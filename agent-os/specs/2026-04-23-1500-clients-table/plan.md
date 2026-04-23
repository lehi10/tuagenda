# Plan: Clients Table `/clients`

Ver el plan completo en: `/Users/lehiquincho/.claude/plans/curried-swimming-sun.md`

## Resumen

Implementar stack hexagonal completo para mostrar clientes reales (Users con Appointments en el negocio). 9 tasks: spec docs → domain → application → infrastructure → tRPC router → UI components.

## Tasks

1. Guardar spec docs (este folder)
2. `IClientRepository` + interfaces (ClientWithStats, ClientDetail, ClientStats)
3. Use cases: GetClientsByBusiness, GetClientStats, GetClientDetail
4. `PrismaClientRepository` (queries via Appointment relation)
5. `client.router.ts` con `businessMemberProcedure`
6. Actualizar `client-stats.tsx` con tRPC real
7. Actualizar `client-list.tsx` con tRPC real + search
8. Crear `client-detail-dialog.tsx`
9. Verificar `clients/page.tsx`
