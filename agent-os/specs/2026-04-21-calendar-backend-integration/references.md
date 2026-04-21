# References

## Similar Implementations

### AppointmentList

- **Location:** `apps/web-app/src/client/features/appointments/components/appointment-list.tsx`
- **Relevance:** Patrón exacto de cómo hacer query a `getBusinessAppointments` con `useTrpc` y `useBusiness`
- **Key patterns:** `useTrpc.appointment.getBusinessAppointments.useQuery({ businessId, pagination }, { enabled })`; mapeo de dominio entity a UI type

### AppointmentStats

- **Location:** `apps/web-app/src/client/features/appointments/components/appointment-stats.tsx`
- **Relevance:** Cómo hacer múltiples queries con filtros de fecha usando `startOfDayInTz`/`endOfDayInTz`
- **Key patterns:** `useBusinessTimezone`, `useBusiness`, queries con `startAfter`/`startBefore`
