# Dashboard Analytics — Shaping Notes

## Scope

Conectar todos los componentes del dashboard `/dashboard` con datos reales del backend.
Actualmente todos usan mock/hardcoded data. La feature agrega endpoints de analytics en tRPC
y actualiza los componentes para consumirlos.

**Componentes afectados:**
- `DashboardStats` — 4 KPI cards (total citas, próximas, clientes, revenue)
- `RevenueChart` — área chart de revenue en el tiempo
- `BookingsChart` — bar chart de bookings por día
- `ServicesChart` — pie chart de distribución de servicios
- `EmployeePerformance` — tabla de rendimiento de empleados
- `RecentAppointments` — lista paginada de citas recientes

## Decisions

- **Solo admin/negocio** ve los reportes; `businessId` viene de `useBusiness()` hook
- **Períodos soportados:** 7days / 30days / 3months / 6months / year (filtro ya existente en UI)
- **Expenses eliminadas:** `RevenueChart` solo muestra "Revenue" — el schema no tiene gastos
- **Analytics = DTOs planos**, no domain entities con `.toObject()`. Los use cases retornan datos directamente.
- **Agregación en JS:** el repositorio Prisma fetcha citas del período, el use case agrupa por fecha/servicio/empleado en memoria. Evita SQL raw.
- **Labels en frontend:** el backend retorna fechas ISO (`YYYY-MM-DD`), el frontend las formatea con Luxon respetando el timezone del negocio.
- **Trend de empleados:** se calcula comparando `bookings` del período actual vs `bookingsPrev` del período anterior de igual duración.

## Context

- **Visuals:** None (saltado por el usuario)
- **References:** `/dashboard` route — todos los componentes estudiados, todos con mock data
- **Product alignment:** N/A (no hay `agent-os/product/`)

## Standards Applied

- `architecture/trpc-use-case-wiring` — instanciar repositorio y use case inline en cada procedure
- `architecture/use-case-result` — `{ success, data?, error? }`, nunca throw
- `trpc/router-structure` — un router por dominio, `analyticsRouter` en `app.router.ts`
- `trpc/superjson-transformer` — Dates llegan como Date en el cliente, Decimal usa `.toNumber()`
