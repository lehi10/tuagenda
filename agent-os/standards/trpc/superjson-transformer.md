# superjson Transformer

tRPC uses superjson as its transformer. `Date` objects, `Map`, `Set`, and `BigInt` survive serialization automatically between server and client.

## What this means

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

## Without superjson (standard JSON)

```typescript
// Standard JSON would serialize Date as string
data.createdAt // → "2026-04-20T10:00:00.000Z" (string, not Date)
new Date(data.createdAt) // ← you'd have to convert manually
```

## Rules

- Never manually convert `Date` to string before returning from a procedure
- Never manually parse date strings on the client — they arrive as `Date` objects
- superjson is configured in both `trpc.ts` (server) and `client.ts` (client) — both must use it
- `Decimal` (Prisma) does NOT survive superjson automatically — call `.toNumber()` before returning
