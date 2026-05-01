# References for Notification System

## Similar Implementations

### Auth Package (`packages/auth`)

- **Location:** `packages/auth/src/`
- **Relevance:** Modelo de package compartido en el monorepo — cómo se exporta, cómo lo importan las apps
- **Key patterns:**
  - `package.json` con `"name": "auth"`, `"main": "./src/index.ts"`
  - Depende de `db` via `workspace:*`
  - Barrel `src/index.ts` exporta solo lo público

### Authorization Port + Adapter

- **Location:** `apps/web-app/src/server/core/domain/ports/IAuthorizationPort.ts` y `apps/web-app/src/server/infrastructure/adapters/AuthorizationAdapter.ts`
- **Relevance:** Único ejemplo de service port (no repository) + su adapter — patrón exacto a seguir para `INotificationSenderPort`
- **Key patterns:**
  - Port define el contrato con parámetros con `_` prefix
  - Adapter implementa el port, recibe dependencias en constructor
  - Router instancia el adapter e inyecta en el use case

### Appointment Router (punto de integración)

- **Location:** `apps/web-app/src/server/trpc/routers/appointment.router.ts`
- **Relevance:** Aquí se agrega el enqueue tras `createAppointmentUseCase.execute()`
- **Key patterns:**
  - `create` es `publicProcedure` (booking de guests y usuarios)
  - Retorna `{ appointment }` directamente
  - Datos relacionados disponibles post-create: `customer`, `service`, `business` (via Prisma include en el repository)

### CreateAppointment Use Case

- **Location:** `apps/web-app/src/server/core/application/use-cases/appointment/CreateAppointment.ts`
- **Relevance:** Retorna `Appointment` con datos relacionados — esos datos se usan para construir el `NotificationJobPayload`
- **Key patterns:**
  - Actualmente retorna `Promise<Appointment>` directo — inconsistente con el estándar
  - El `appointment` retornado incluye `customer`, `service`, `business` completos
