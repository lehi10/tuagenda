# Notification System — Shaping Notes

## Scope

Sistema de notificaciones asíncrono para enviar confirmaciones y recordatorios de citas a clientes via email (Brevo) y WhatsApp (Meta Cloud API). Procesamiento en background via BullMQ + Redis en Railway. Next.js en Vercel solo encola jobs, un worker Node.js separado en Railway los procesa.

## Decisions

- **Sin pagos por ahora** — Stripe no disponible en Perú; pago directo entre cliente y proveedor
- **Brevo para email** — ya tiene cuenta y licencia
- **Meta Cloud API directo para WhatsApp** — Brevo WA demasiado caro; alternativas no oficiales (Baileys, UltraMsg) riesgo de ban del número
- **Cola con BullMQ + Redis** — necesaria para recordatorios programados y reintentos; Railway para Redis + Worker
- **Sin cola en Vercel** — Vercel serverless no soporta workers long-running; solo encola, Railway procesa
- **Datos desnormalizados en el job** — el worker no consulta DB; todos los datos se resuelven al encolar
- **Fire-and-forget** — si Redis falla al encolar, la cita se crea igual; nunca bloquear al usuario
- **`BullMQNotificationQueueAdapter.enqueue()` cierra conexión** — Vercel serverless no soporta conexiones persistentes

## Canales por negocio

- Configurable por negocio, no por cliente (por ahora)
- El negocio puede habilitar: `email`, `whatsapp`, o ambos
- Los canales se resuelven al encolar y viajan en el payload — worker no consulta DB
- Usar `NotificationChannel` y `NotificationEvent` como const objects, nunca strings literales

## Triggers iniciales

- `appointment.created` — al crear una cita
- `appointment.cancelled` — al cancelar una cita (iteración siguiente)

## Context

- **Visuals:** None
- **References:** `packages/auth` (estructura de package compartido), `apps/web-app/src/server/core/domain/ports/IAuthorizationPort.ts` (service port pattern), `apps/web-app/src/server/infrastructure/adapters/AuthorizationAdapter.ts` (service adapter pattern), `apps/web-app/src/server/trpc/routers/appointment.router.ts` (punto de integración)
- **Product alignment:** N/A — no existe agent-os/product/

## Standards Applied

- `architecture/ports-and-adapters` — `INotificationSenderPort` en `/ports/`, `INotificationQueuePort` en `/ports/`, adapters en `infrastructure/`
- `architecture/use-case-result` — `EnqueueAppointmentNotificationUseCase` retorna `Promise<EnqueueResult>` con Result wrapper
- `architecture/trpc-use-case-wiring` — router instancia `BullMQNotificationQueueAdapter` + use case inline, en try/catch separado
- `architecture/mapper-convention` — no aplica directamente (no hay entidad Prisma nueva)
