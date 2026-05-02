# References for Appointments Page Improvements

## Similar Implementations

### GetBusinessAppointments use case

- **Location:** `apps/web-app/src/server/core/application/use-cases/appointment/GetBusinessAppointments.ts`
- **Relevance:** Patrón a seguir para el nuevo `UpdateAppointmentStatus` use case
- **Key patterns:** Result wrapper `{ success, appointments?, total?, error? }`, try/catch con logger, inyección de `IAppointmentRepository`

### appointment.router.ts — getBusinessAppointments procedure

- **Location:** `apps/web-app/src/server/trpc/routers/appointment.router.ts` (líneas 182–244)
- **Relevance:** Patrón para la nueva mutación `updateStatus` — uso de `businessMemberProcedure`, instanciación inline
- **Key patterns:** `businessMemberProcedure`, `ctx.businessId`, Zod input validation, TRPCError handling

### PrismaAppointmentRepository.update()

- **Location:** `apps/web-app/src/server/infrastructure/repositories/PrismaAppointmentRepository.ts` (línea 239)
- **Relevance:** Método ya existe para actualizar un appointment en DB
- **Key patterns:** Recibe un `Appointment` entity completo, retorna el entity actualizado

### PrismaAppointmentRepository.findById()

- **Location:** `apps/web-app/src/server/infrastructure/repositories/PrismaAppointmentRepository.ts` (línea 27)
- **Relevance:** Usado en el use case para verificar que el appointment existe y pertenece al businessId correcto antes de actualizar
