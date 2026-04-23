# References for Clients Table

## Similar Implementations

### Users Page
- **Location:** `apps/web-app/src/app/(private)/users/page.tsx` + `client/features/clients/` pattern
- **Relevance:** Mismo patrón de tabla con búsqueda, filtros, DataTableWithFilters
- **Key patterns:** Estado local search, columnas con Avatar, Badge para status, DropdownMenu de acciones

### Analytics Router (businessMemberProcedure)
- **Location:** `apps/web-app/src/server/trpc/routers/analytics.router.ts`
- **Relevance:** Ejemplo de router que usa `businessMemberProcedure` con `ctx.businessId`
- **Key patterns:** `businessId` viene de `ctx`, no del input

### User Repository (Prisma)
- **Location:** `apps/web-app/src/server/infrastructure/repositories/PrismaUserRepository.ts`
- **Relevance:** Patrón de queries Prisma con filtros opcionales, search con OR
- **Key patterns:** `where` dinámico con spread condicional, mappers inline

### IUserRepository Interface
- **Location:** `apps/web-app/src/server/core/domain/repositories/IUserRepository.ts`
- **Relevance:** Estructura de interfaz repository con filters tipados
- **Key patterns:** `UserRepositoryFilters` interface separada, métodos con `_` prefix

### GetAllUsers Use Case
- **Location:** `apps/web-app/src/server/core/application/use-cases/user/GetAllUsers.ts`
- **Relevance:** Patrón use case con result shape estándar
- **Key patterns:** try/catch, `{ success, users?, total?, error? }`
