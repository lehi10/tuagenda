# Standards for Dashboard Analytics

The following standards apply to this work.

---

## architecture/trpc-use-case-wiring

tRPC routers act as the composition root. Repositories and use cases are instantiated inline inside each procedure handler.

### Pattern

```typescript
getById: privateProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const userRepository = new PrismaUserRepository();
    const getUserUseCase = new GetUserUseCase(userRepository);
    const result = await getUserUseCase.execute({ id: input.userId });
    if (!result.success || !result.user) {
      throw new TRPCError({ code: "NOT_FOUND", message: result.error });
    }
    return result.user.toObject();
  }),
```

### Rules
- Repositories and use cases are always instantiated inline — no global DI container
- Each procedure creates fresh instances per request
- Domain entities are never returned directly — always call `.toObject()` first
- The router is the only layer allowed to import from `infrastructure/repositories/`
- Input validation is handled by Zod before the handler runs
- Auth is enforced by `privateProcedure`

> **Note for analytics:** Analytics use cases return plain DTOs (not domain entities), so `.toObject()` is NOT called. Return `result.data` directly.

---

## architecture/use-case-result

Every use case returns a result object. Never throw exceptions — errors are returned as values.

### Structure

```typescript
export interface GetDashboardStatsResult {
  success: boolean;
  data?: DashboardStats;
  error?: string;
}

export class GetDashboardStatsUseCase {
  async execute(input): Promise<GetDashboardStatsResult> {
    try {
      const data = await this.analyticsRepository.getDashboardStats(input);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

### Rules
- Always define a typed `XResult` interface per use case
- `success: false` must always include `error: string`
- `success: true` must always include the expected data field
- The use case never throws — the caller (router) decides how to surface the error

---

## trpc/router-structure

One router per domain entity, all merged in `app.router.ts`.

### File naming
```
src/server/trpc/routers/
  app.router.ts          ← merges all routers
  analytics.router.ts    ← NEW for this feature
  appointment.router.ts
  ...
```

### Rules
- One router file per domain entity
- All routers registered in `app.router.ts`
- `AppRouter` type must be re-exported after adding new router

---

## trpc/superjson-transformer

Date objects survive serialization automatically. Decimal must use `.toNumber()`.

### Rules
- Never manually convert `Date` to string before returning from a procedure
- `Decimal` (Prisma) does NOT survive superjson — call `.toNumber()` before returning
- `service.price` is a `Decimal` — convert with `.toNumber()` in the repository
