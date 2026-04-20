# tRPC-to-UseCase Wiring

tRPC routers act as the composition root. Repositories and use cases are instantiated inline inside each procedure handler.

## Pattern

```typescript
getById: privateProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    // 1. Instantiate repository (composition root)
    const userRepository = new PrismaUserRepository();

    // 2. Instantiate use case with repository injected
    const getUserUseCase = new GetUserUseCase(userRepository);

    // 3. Execute
    const result = await getUserUseCase.execute({ id: input.userId });

    // 4. Handle result
    if (!result.success || !result.user) {
      throw new TRPCError({ code: "NOT_FOUND", message: result.error });
    }

    // 5. Convert domain entity to plain object before returning
    return result.user.toObject();
  }),
```

## Rules

- Repositories and use cases are always instantiated inline — no global DI container
- Each procedure creates fresh instances per request
- Domain entities are never returned directly — always call `.toObject()` first
- The router is the only layer allowed to import from `infrastructure/repositories/`
- Input validation is handled by Zod (`.input(z.object(...))`) before the handler runs
- Auth is enforced by `privateProcedure` — use `publicProcedure` only for booking flow and guest operations

## Note

The router knowing about `PrismaXRepository` is an intentional trade-off: it keeps the code explicit and easy to follow. A separate composition root (`dependencies.ts`) was considered but not adopted.
