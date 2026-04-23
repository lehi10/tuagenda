# Clients Table — Shaping Notes

## Scope

Implementar la página `/clients` con datos reales en lugar de mocks. Un "cliente" se define como un `User` que tiene al menos un `Appointment` en el negocio actual. No se requiere migración de base de datos.

**Operaciones:**
- Lista de clientes con búsqueda y filtros
- Vista de detalle: info del cliente + historial de citas

**Fuera de scope:** editar, eliminar clientes (próxima iteración).

## Decisions

- **Definición de cliente:** User con `appointmentsAsCustomer.some({ businessId })` — sin nueva tabla
- **Business context:** `ctx.businessId` vía `businessMemberProcedure` (header `x-business-id`)
- **Stats:** total, nuevos este mes (firstVisit), retention rate (>1 cita / total)
- **Detalle:** dialog modal (no página separada), carga lazy al hacer click en fila
- **No se crea entidad Client:** se usan interfaces simples (ClientWithStats, ClientDetail) porque no hay lógica de negocio propia — ver excepción en entity-structure standard

## Context

- **Visuals:** None — seguir patrón visual de `/users`
- **References:** `/users` page + hexagonal pattern de `analytics.router.ts` para `businessMemberProcedure`
- **Product alignment:** N/A (no product folder)

## Standards Applied

- `architecture/entity-structure` — No se crea entidad, se usan interfaces (excepción válida: sin lógica de negocio)
- `architecture/trpc-use-case-wiring` — Instanciación inline en procedures, `.toObject()` no aplica (interfaces planas)
- `architecture/use-case-result` — `{ success, data?, error? }`, nunca throw en use case
- `trpc/router-structure` — Un router por dominio, registrar en `app.router.ts`
- `trpc/token-auto-attach` — Token automático, businessId via `x-business-id` header
