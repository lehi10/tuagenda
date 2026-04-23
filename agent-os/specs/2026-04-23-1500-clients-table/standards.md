# Standards for Clients Table

## architecture/entity-structure

Domain entities: private fields, constructor validation, `touch()`, `toObject()`/`fromObject()`.

**Aplicación:** No se crea entidad `Client` porque no hay lógica de negocio propia. Se usan interfaces planas (`ClientWithStats`, `ClientDetail`) — excepción válida per el estándar: *"Plain interfaces are allowed for simplified read shapes with no business logic"*.

---

## architecture/trpc-use-case-wiring

tRPC router como composition root. Repositories y use cases se instancian inline en cada procedure.

**Aplicación:** En `client.router.ts` cada procedure instancia `new PrismaClientRepository()` y el use case correspondiente. No DI container. Las interfaces planas no requieren `.toObject()` — se retornan directamente.

---

## architecture/use-case-result

`{ success: boolean, data?, error? }` — nunca throw en use case, el caller (router) decide el TRPCError.

**Aplicación:** Los tres use cases (GetClientsByBusiness, GetClientStats, GetClientDetail) retornan `{ success, [data]?, error? }` con try/catch interno.

---

## trpc/router-structure

Un router por entidad de dominio, todos mergeados en `app.router.ts`.

**Aplicación:** Crear `client.router.ts` y registrar como `client: clientRouter` en `app.router.ts`.

---

## trpc/token-auto-attach

Token Firebase se agrega automáticamente. `businessId` viaja via header `x-business-id` — nunca pasar manualmente.

**Aplicación:** Usar `businessMemberProcedure` que lee `ctx.businessId` del middleware. El cliente ya envía el header automáticamente via `TRPCProvider`.
