# Plan: Sistema de Notificaciones (Email + WhatsApp)

## Context

TuAgenda necesita notificar a clientes cuando se crea o cancela una cita. Los canales son email (Brevo) y WhatsApp (Meta Cloud API). El procesamiento es asíncrono via BullMQ + Redis (Railway). El código respeta arquitectura hexagonal: Next.js solo conoce ports, nunca adapters concretos.

## Estructura final del monorepo

```
apps/
  web-app/          ← existente (Vercel)
  worker/           ← NUEVO (Railway) — procesa jobs de BullMQ
packages/
  db/               ← existente
  auth/             ← existente
  notifications/    ← NUEVO — ports, use cases, adapters
```

## packages/notifications — estructura

```
packages/notifications/src/
  core/
    domain/
      ports/
        INotificationSenderPort.ts   ← interface: send(request) → result
        INotificationQueuePort.ts    ← interface: enqueue(payload)
      types/
        NotificationJobPayload.ts    ← shape del job en Redis
        NotificationEvent.ts         ← 'appointment.created' | 'appointment.cancelled'
        NotificationChannel.ts       ← 'email' | 'whatsapp'
    application/
      use-cases/
        EnqueueAppointmentNotification.ts  ← usado por web-app, retorna Result wrapper
        SendAppointmentNotification.ts     ← usado por worker
  infrastructure/
    queue/
      BullMQNotificationQueueAdapter.ts
    senders/
      BrevoEmailAdapter.ts
      MetaWhatsAppAdapter.ts
  index.ts                ← barrel público: ports + types + use cases
  infrastructure/index.ts ← barrel infra: adapters
```

**Regla de imports:**
- `web-app` importa de `notifications` → ports + use cases
- `web-app` importa `BullMQNotificationQueueAdapter` de `notifications/infrastructure` (único adapter permitido)
- `worker` importa de `notifications/infrastructure` → todos los adapters

## Tipos con const objects (sin hardcoding)

```typescript
// NotificationChannel.ts
export const NotificationChannel = {
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
} as const;
export type NotificationChannel = typeof NotificationChannel[keyof typeof NotificationChannel];

// NotificationEvent.ts
export const NotificationEvent = {
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_CANCELLED: 'appointment.cancelled',
} as const;
export type NotificationEvent = typeof NotificationEvent[keyof typeof NotificationEvent];
```

Usar siempre `NotificationChannel.EMAIL`, `NotificationEvent.APPOINTMENT_CREATED`, etc. Nunca strings literales.

## NotificationJobPayload

```typescript
interface NotificationJobPayload {
  event: NotificationEvent;
  appointmentId: string;
  businessId: string;
  channels: NotificationChannel[];  // resuelto al encolar desde config del negocio
  customer: { firstName: string; lastName: string | null; email: string; phone: string | null; };
  service: { name: string; durationMinutes: number; price: number; };
  business: { title: string; phone: string; email: string; currency: string; };
  appointment: { startTime: string; endTime: string; notes: string | null; };
}
```

- `channels` se resuelve al encolar leyendo la config del negocio
- Worker filtra: `if (payload.channels.includes(sender.channel))`
- Datos desnormalizados — worker no consulta DB

## Config de canales por negocio

La config de canales habilitados vive en el modelo `Business` (campo a agregar al schema Prisma). El `EnqueueAppointmentNotificationUseCase` la lee del `appointment.business` al construir el payload.

## Integración en appointment.router.ts

```typescript
// fire-and-forget — nunca falla la cita si Redis falla
try {
  const queueAdapter = new BullMQNotificationQueueAdapter();
  const enqueueUseCase = new EnqueueAppointmentNotificationUseCase(queueAdapter);
  await enqueueUseCase.execute({ event: NotificationEvent.APPOINTMENT_CREATED, appointment });
} catch (e) {
  console.error('[notifications] Failed to enqueue:', e);
}
```

`BullMQNotificationQueueAdapter.enqueue()` cierra la conexión Redis al terminar (Vercel serverless).

## apps/worker/src/index.ts

```typescript
const senders = [new BrevoEmailAdapter(), new MetaWhatsAppAdapter()];
const useCase = new SendAppointmentNotificationUseCase(senders);
const worker = new Worker('notifications', async (job) => {
  await useCase.execute(job.data);
}, { connection: { url: process.env.REDIS_URL }, concurrency: 5 });
```

## Secuencia de implementación

### Task 1: Guardar spec
Archivos en `agent-os/specs/2026-05-01-1500-notification-system/` ✅

### Task 2: Crear packages/notifications (domain + application)
- `package.json` con `name: "notifications"`, deps: `bullmq`
- Ports: `INotificationSenderPort`, `INotificationQueuePort`
- Types: `NotificationJobPayload`, `NotificationEvent`, `NotificationChannel`
- Use cases: `EnqueueAppointmentNotification`, `SendAppointmentNotification`
- Barrels: `index.ts` y `infrastructure/index.ts`

### Task 3: Agregar infrastructure adapters
- `BullMQNotificationQueueAdapter` — cierra conexión post-enqueue
- `BrevoEmailAdapter` — usa Brevo REST API con template IDs
- `MetaWhatsAppAdapter` — usa Meta Graph API con templates aprobados

### Task 4: Agregar Redis a docker-compose.yml
Para desarrollo local.

### Task 5: Integrar en appointment.router.ts
- Agregar `"notifications": "workspace:*"` a `apps/web-app/package.json`
- Encolar job post-create en try/catch separado

### Task 6: Crear apps/worker
- `package.json`, `tsconfig.json`
- `src/index.ts` con BullMQ Worker

### Task 7: Deploy
- Redis en Railway → obtener `REDIS_URL`
- `REDIS_URL` en Vercel env vars
- Worker en Railway con todas las env vars

## Variables de entorno

**Vercel:** `REDIS_URL`

**Railway worker:** `REDIS_URL`, `BREVO_API_KEY`, `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`, `BREVO_TEMPLATE_APPOINTMENT_CREATED`, `BREVO_TEMPLATE_APPOINTMENT_CANCELLED`, `META_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `META_TEMPLATE_APPOINTMENT_CREATED`, `META_TEMPLATE_APPOINTMENT_CANCELLED`

## Verificación

1. Crear cita → verificar job en Redis (`redis-cli monitor`)
2. Worker procesa → email en bandeja Brevo sandbox
3. Worker procesa → mensaje WhatsApp (número prueba Meta)
4. Apagar Redis → cita se crea igual (notificación falla silenciosamente)
5. Reiniciar Redis → worker procesa jobs pendientes

## Agregar nuevo proveedor

1. Nuevo adapter en `packages/notifications/src/infrastructure/senders/`
2. Registrar en `apps/worker/src/index.ts`
3. Cero cambios en web-app ni en los ports
