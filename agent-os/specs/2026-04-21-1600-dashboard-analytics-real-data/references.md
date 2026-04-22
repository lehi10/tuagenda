# References for Dashboard Analytics

## Similar Implementations

### Appointment Router (tRPC wiring pattern)

- **Location:** `apps/web-app/src/server/trpc/routers/appointment.router.ts`
- **Relevance:** Shows how to wire a private procedure with Zod input, instantiate repository + use case inline, and return data.
- **Key patterns:** `privateProcedure`, inline `new PrismaXRepository()`, `new XUseCase(repo)`, result check pattern.

### PrismaAppointmentRepository (Prisma adapter pattern)

- **Location:** `apps/web-app/src/server/infrastructure/repositories/PrismaAppointmentRepository.ts`
- **Relevance:** Shows how to build a Prisma repository. Analytics repo follows the same file structure and import patterns.
- **Key patterns:** `prisma.appointment.findMany` with filters, `include` for relations, `Decimal` handling.

### BusinessContext (useBusiness hook)

- **Location:** `apps/web-app/src/client/contexts/business-context.tsx`
- **Relevance:** The `useBusiness()` hook provides `currentBusiness.id` — this is how all dashboard components get the `businessId` to pass to analytics queries.
- **Key patterns:** `const { currentBusiness } = useBusiness();` then `currentBusiness?.id`.

### GetBusinessAppointments Use Case

- **Location:** `apps/web-app/src/server/core/application/use-cases/appointment/GetBusinessAppointments.ts`
- **Relevance:** Example of a business-scoped use case that returns a list result.
- **Key patterns:** Constructor injection of `IAppointmentRepository`, typed result interface.

### Dashboard Page (component orchestration)

- **Location:** `apps/web-app/src/app/(private)/dashboard/page.tsx`
- **Relevance:** Parent page that coordinates `chartsPeriod` state and passes it to child components. The analytics integration extends this pattern.
- **Key patterns:** `useState("7days")` for period, passing period as prop to chart components.

### Existing Dashboard Components (mock → real migration targets)

- `apps/web-app/src/client/features/dashboard/components/dashboard-stats.tsx`
- `apps/web-app/src/client/features/dashboard/components/revenue-chart.tsx`
- `apps/web-app/src/client/features/dashboard/components/bookings-chart.tsx`
- `apps/web-app/src/client/features/dashboard/components/services-chart.tsx`
- `apps/web-app/src/client/features/dashboard/components/employee-performance.tsx`
- `apps/web-app/src/client/features/dashboard/components/recent-appointments.tsx`
