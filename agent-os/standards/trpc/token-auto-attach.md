# Firebase Token Auto-Attach

The Firebase ID token is automatically added as a `Bearer` header on every tRPC request. No manual token passing needed.

## How it works

```typescript
// src/client/lib/trpc/client.ts — configured once, works everywhere
httpBatchLink({
  url: "/api/trpc",
  transformer: superjson,
  async headers() {
    const user = getFirebaseAuth().currentUser;
    if (!user) return {};
    const token = await user.getIdToken(); // auto-refreshed by Firebase
    return { authorization: `Bearer ${token}` };
  },
})
```

## Rules

- Never pass the token manually to tRPC calls — it's handled automatically
- `user.getIdToken()` auto-refreshes the token if expired — no manual refresh needed
- Unauthenticated users send no header → `ctx.userId = null` → `privateProcedure` throws `UNAUTHORIZED`
- This applies to both `useTrpc` and `trpc` clients — not to `serverTrpc` (server-side, no Firebase)
