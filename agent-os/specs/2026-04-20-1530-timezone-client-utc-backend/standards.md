# Standards for Timezone Support

The following standards apply to this work.

---

## trpc/superjson-transformer

tRPC uses superjson as its transformer. `Date` objects, `Map`, `Set`, and `BigInt` survive serialization automatically between server and client.

### What this means

```typescript
// Server — returns a real Date
.query(() => {
  return { createdAt: new Date() }; // ← Date object
})

// Client — receives a real Date (not a string)
const { data } = useTrpc.user.me.useQuery();
data.createdAt instanceof Date // ← true, no conversion needed
data.createdAt.toLocaleDateString() // ← works directly
```

### Rules

- Never manually convert `Date` to string before returning from a procedure
- Never manually parse date strings on the client — they arrive as `Date` objects
- superjson is configured in both `trpc.ts` (server) and `client.ts` (client) — both must use it
- `Decimal` (Prisma) does NOT survive superjson automatically — call `.toNumber()` before returning

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

---

## trpc/router-structure

One router per domain entity, all merged in `app.router.ts`. The `getAvailableTimeSlots` procedure lives in `businessUser.router.ts`.
