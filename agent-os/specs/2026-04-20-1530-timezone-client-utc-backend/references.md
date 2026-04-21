# References for Timezone Support

## Similar Implementations

### Business Timezone Selector

- **Location:** `apps/web-app/src/client/features/business/components/business-form-dialog.tsx`
- **Relevance:** Ya existe un Select de timezone para el negocio con lista hardcodeada de IANA timezones. Esta lista se centraliza en `SUPPORTED_TIMEZONES` de `timezone-utils.ts`.
- **Key patterns:** `<Select value={formData.timeZone} onValueChange={(value) => handleChange("timeZone", value)}>` — el mismo patrón se reutiliza en el booking flow.

### Booking Payment Step (bug source)

- **Location:** `apps/web-app/src/client/components/booking/payment-step.tsx` líneas 79-99
- **Relevance:** Aquí está el bug principal. Construye `startTime` con `setHours()` en browser timezone en lugar de business timezone.
- **Fix:** Reemplazar con `slotToUtcDate(date, slotTime, businessTimezone)` de `timezone-utils.ts`.

### Appointment List Display

- **Location:** `apps/web-app/src/client/features/appointments/components/appointment-list.tsx` líneas 61-62
- **Relevance:** Usa `format()` de date-fns sin timezone, mostrando fechas en browser timezone.
- **Fix:** Usar `formatInTz(date, userTimezone, formatStr)` de `timezone-utils.ts`.

### getAvailableTimeSlots Route

- **Location:** `apps/web-app/src/server/trpc/routers/businessUser.router.ts` líneas 284-323
- **Relevance:** Devuelve slots como `{ time: "HH:mm", available: boolean }[]`. El cliente necesita saber el timezone del negocio para interpretar estas horas.
- **Fix:** Incluir `businessTimezone: string` en el response.

### GetAvailableTimeSlots Use Case

- **Location:** `apps/web-app/src/server/core/application/use-cases/availability/GetAvailableTimeSlots.ts`
- **Relevance:** Tiene un comentario en líneas 13-20 que documenta exactamente el problema de timezone y propone instalar `date-fns-tz`.
- **Key patterns:** Usar `fromZonedTime`/`toZonedTime` de date-fns-tz para convertir tiempos del negocio a UTC.
