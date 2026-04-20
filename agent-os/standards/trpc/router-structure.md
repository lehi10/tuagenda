# Router Structure

One router per domain entity, all merged in `app.router.ts`.

## File naming

```
src/server/trpc/routers/
  app.router.ts          ← merges all routers, exports AppRouter type
  user.router.ts
  business.router.ts
  service.router.ts
  appointment.router.ts
  [entity].router.ts     ← one per domain entity
```

## app.router.ts pattern

```typescript
export const appRouter = router({
  health: publicProcedure.query(() => ({ status: "ok" })),
  user: userRouter,
  business: businessRouter,
  service: serviceRouter,
  // ...
});

export type AppRouter = typeof appRouter; // ← used by client for type safety
```

## Rules

- One router file per domain entity
- Router name matches entity name: `userRouter`, `serviceRouter`, etc.
- All routers are registered in `app.router.ts` — never call a sub-router directly
- `AppRouter` type must be exported from `app.router.ts` for client type inference
- If a router grows too large, split by subdomain (e.g. `employeeAvailability.router.ts`, `employeeService.router.ts`)
- Procedure names use camelCase and describe the action: `getById`, `create`, `updateProfile`, `listPublic`
