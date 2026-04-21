# Plan: Timezone Support — Client-side con UTC en Backend

## Context

Las citas se están guardando con la hora del timezone del navegador del usuario, pero los slots de disponibilidad se generan asumiendo el timezone del servidor (UTC). Esto causa que si el negocio está en EST y el usuario en PST, un slot "09:00" se guarda como 9 AM PST (= 2 PM UTC) en lugar de 9 AM EST (= 2 PM UTC). Además, la visualización de fechas usa el timezone local del browser sin conversión explícita.

**Objetivo:** Un solo lugar en el cliente maneja toda la lógica de timezone. El backend solo trabaja con UTC. El booking flow muestra el timezone correcto y permite override manual.

---

## Architecture Decision

- **Backend (tRPC):** Solo recibe y devuelve UTC. El router `getAvailableTimeSlots` incluirá el `businessTimezone` en el response para que el cliente sepa cómo interpretar los slots.
- **Frontend:** 
  - `timezone-utils.ts` — funciones puras de conversión (single source of truth)
  - `useTimezone.ts` — hook que auto-detecta y permite override manual
  - Todos los componentes que muestran fechas usan estas utilidades
  - Al crear cita: convierte slot "HH:mm" en businessTimezone → UTC

---

## Tasks

### Task 1: Save Spec Documentation

Crear `agent-os/specs/2026-04-20-1530-timezone-client-utc-backend/` con plan.md, shape.md, standards.md, references.md.

---

### Task 2: Instalar date-fns-tz

```bash
pnpm --filter web-app add date-fns-tz
```

Archivo: `apps/web-app/package.json`

---

### Task 3: Crear `timezone-utils.ts`

**Archivo nuevo:** `apps/web-app/src/client/lib/timezone-utils.ts`

Funciones a implementar:

```typescript
// Formato de fecha UTC en un timezone específico
formatInTz(date: Date, tz: string, formatStr: string): string

// Convierte "HH:mm" en businessTimezone + una fecha base → UTC Date
slotToUtcDate(date: Date, slotTime: string, businessTz: string): Date

// Devuelve el timezone del navegador
getBrowserTimezone(): string

// Lista de timezones para el selector (misma lista que el business form)
SUPPORTED_TIMEZONES: { value: string; label: string }[]
```

Usa `date-fns-tz`: `fromZonedTime`, `toZonedTime`, `format` (de date-fns-tz).

---

### Task 4: Crear `useTimezone` hook

**Archivo nuevo:** `apps/web-app/src/client/hooks/use-timezone.ts`

```typescript
// Auto-detecta timezone del navegador, permite override guardado en localStorage
function useTimezone(): {
  userTimezone: string;       // tz del usuario (browser o manual)
  setUserTimezone: (tz: string) => void;
}
```

- Default: `getBrowserTimezone()` de timezone-utils
- Persiste en localStorage key `"tuagenda_tz"`

---

### Task 5: Actualizar `getAvailableTimeSlots` — incluir businessTimezone en response

**Archivo:** `apps/web-app/src/server/trpc/routers/businessUser.router.ts`  
**Líneas ~284-323**

Cambio: La query necesita obtener el timezone del negocio para incluirlo en el response.

Opciones (elegir la más limpia):
- Opción A: Agregar `businessId` al input, hacer query del business en el router, incluir `timezone` en response
- Opción B (preferida): El `GetAvailableTimeSlotsUseCase` ya tiene acceso al `businessUserId` → agregar un `BusinessRepository` al use case para obtener el timezone y devolverlo en el result

**Response actual:** `{ slots, total, available }`  
**Response nuevo:** `{ slots, total, available, businessTimezone: string }`

**Archivo use case:** `apps/web-app/src/server/core/application/use-cases/availability/GetAvailableTimeSlots.ts`

---

### Task 6: Corregir construcción de fecha en booking — `payment-step.tsx`

**Archivo:** `apps/web-app/src/client/components/booking/payment-step.tsx`  
**Líneas ~79-99**

**Actual (buggy):**
```typescript
const startTime = new Date(bookingData.date);
startTime.setHours(hours, minutes, 0, 0);  // usa browser timezone ❌
startTime: startTime.toISOString(),
```

**Correcto:**
```typescript
import { slotToUtcDate } from "@/client/lib/timezone-utils";

const startTime = slotToUtcDate(bookingData.date, bookingData.timeSlot, businessTimezone);
const endTime = new Date(startTime.getTime() + bookingData.service.durationMinutes * 60000);
startTime: startTime.toISOString(),
endTime: endTime.toISOString(),
```

El `businessTimezone` viene de la data del negocio disponible en el booking context.

---

### Task 7: Agregar timezone info + selector en booking time selection

**Archivo:** `apps/web-app/src/client/components/booking/time-slot-selection.tsx`

Cambios:
1. Mostrar el timezone del negocio en el que se muestran los slots (ej: "Times shown in EST (New York)")
2. Agregar pequeño selector para que el usuario pueda ver los slots en su propio timezone (usando `useTimezone`)
3. Usar `formatInTz` para convertir slots a display en el timezone seleccionado

Props adicionales necesarios: `businessTimezone: string` (viene del response de `getAvailableTimeSlots`)

---

### Task 8: Actualizar visualización de citas — `appointment-list.tsx`

**Archivo:** `apps/web-app/src/client/features/appointments/components/appointment-list.tsx`  
**Líneas ~61-62**

**Actual:**
```typescript
date: format(new Date(apt.startTime), "yyyy-MM-dd"),
time: format(new Date(apt.startTime), "h:mm a"),
```

**Correcto:**
```typescript
import { formatInTz } from "@/client/lib/timezone-utils";

date: formatInTz(apt.startTime, userTimezone, "yyyy-MM-dd"),
time: formatInTz(apt.startTime, userTimezone, "h:mm a"),
```

Obtener `userTimezone` del hook `useTimezone()`.

---

### Task 9: Actualizar calendar event adapter

**Archivo:** `apps/web-app/src/client/features/calendar/utils/event-adapter.ts`

FullCalendar maneja su propio sistema de timezones. Agregar el `timeZone` del negocio al config del calendario en `appointments-calendar.tsx` para que muestre las citas en el timezone correcto.

**Archivo:** `apps/web-app/src/client/features/calendar/components/appointments-calendar.tsx`  
Agregar prop `timeZone` al FullCalendar component usando el timezone del negocio.

---

## Standards Aplicados

- **trpc/superjson-transformer:** Dates sobreviven serialización automáticamente. El backend retorna `Date` objects, llegan como `Date` al cliente. NO convertir manualmente strings ↔ Date en el transporte.
- **architecture/trpc-use-case-wiring:** Al modificar el use case `GetAvailableTimeSlots`, inyectar el nuevo repositorio inline en el router (no un DI container).

---

## Archivos Críticos

| Archivo | Cambio |
|---|---|
| `apps/web-app/package.json` | + date-fns-tz |
| `apps/web-app/src/client/lib/timezone-utils.ts` | NUEVO — funciones de conversión |
| `apps/web-app/src/client/hooks/use-timezone.ts` | NUEVO — hook de timezone |
| `apps/web-app/src/server/trpc/routers/businessUser.router.ts` | + businessTimezone en response |
| `apps/web-app/src/server/core/application/use-cases/availability/GetAvailableTimeSlots.ts` | + timezone en result |
| `apps/web-app/src/client/components/booking/payment-step.tsx` | Fix: slotToUtcDate |
| `apps/web-app/src/client/components/booking/time-slot-selection.tsx` | + timezone display/selector |
| `apps/web-app/src/client/features/appointments/components/appointment-list.tsx` | Fix: formatInTz |
| `apps/web-app/src/client/features/calendar/components/appointments-calendar.tsx` | + timeZone prop |
| `apps/web-app/src/client/features/business/components/business-form-dialog.tsx` | Fix: SUPPORTED_TIMEZONES + auto-detect default |
| `apps/web-app/src/client/features/appointments/components/appointment-stats.tsx` | Fix: date ranges en UTC |
| `apps/web-app/src/client/lib/__tests__/timezone-utils.test.ts` | NUEVO — tests de timezone-utils |

---

---

### Task 10: Reemplazar datos hardcodeados de timezone

**Problema encontrado:** El selector de timezone del negocio tiene la lista hardcodeada en el JSX.

**Archivo:** `apps/web-app/src/client/features/business/components/business-form-dialog.tsx`

Cambios:
1. Línea 135: Cambiar `|| "America/New_York"` → `|| getBrowserTimezone()` (auto-detect)
2. Líneas 484-506: Reemplazar los `<SelectItem>` hardcodeados con un `.map()` usando `SUPPORTED_TIMEZONES` de `timezone-utils.ts`

**Archivo:** `apps/web-app/src/client/features/appointments/components/appointment-stats.tsx`

Líneas 14-20: Las fechas `startOfToday`, `endOf30Days`, `startOfMonth`, `endOfMonth` se construyen en browser timezone. Usar `formatInTz` o construir en UTC explícito para que los filtros del backend sean correctos.

---

### Task 11: Agregar tests para `timezone-utils.ts`

**Archivo nuevo:** `apps/web-app/src/client/lib/__tests__/timezone-utils.test.ts`

Framework: Jest (ya instalado). Seguir el patrón de `src/shared/validations/__tests__/user.schema.test.ts`.

Tests a cubrir:

```typescript
describe("timezone-utils", () => {
  describe("formatInTz", () => {
    it("formats UTC date in EST timezone correctly");
    it("formats UTC date in PST timezone correctly");
    it("formats UTC date in CET timezone correctly");
  });

  describe("slotToUtcDate", () => {
    it("converts '09:00' in EST to correct UTC (14:00 UTC)");
    it("converts '09:00' in PST to correct UTC (17:00 UTC)");
    it("handles DST transitions correctly");
    it("handles midnight boundary correctly");
  });

  describe("getBrowserTimezone", () => {
    it("returns a valid IANA timezone string");
  });

  describe("SUPPORTED_TIMEZONES", () => {
    it("contains all expected timezones");
    it("each entry has value and label fields");
  });
});
```

---

## Verificación

1. Crear un negocio en EST (New York), disponibilidad 9 AM - 5 PM
2. Desde un browser con timezone en PST (o cambiar `Intl.DateTimeFormat` en devtools), abrir el booking flow
3. Verificar que los slots se muestran en EST (no PST)
4. Agendar una cita a las "10:00 AM"
5. En la DB, verificar que `startTime` = `2026-04-20T15:00:00.000Z` (10 AM EST = 3 PM UTC) ✓
6. En la lista de citas del cliente, verificar que muestra "10:00 AM EST" no "7:00 AM PST"
7. Cambiar el timezone override a "Europe/Madrid" → slots muestran en hora española
