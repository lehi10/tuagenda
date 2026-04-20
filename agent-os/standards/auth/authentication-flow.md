# Authentication Flow

Firebase handles authentication. Every server request is stateless — no server-side sessions.

## Flow

```
Client                          Server (tRPC)
  |                                  |
  |-- Firebase signIn() ---------->  |
  |<- ID Token (JWT) -------------   |
  |                                  |
  |-- Request + Bearer <token> --> createContext()
  |                               verifyAuthToken(token)  ← Firebase Admin SDK
  |                               → { userId, userEmail } in ctx
  |                                  |
  |                               privateProcedure checks ctx.userId
  |<- Response --------------------  |
```

## Key files

- `src/server/trpc/trpc.ts` — `createContext()` verifies token on every request
- `src/server/lib/auth/firebase/admin.ts` — `verifyAuthToken()` calls Firebase Admin
- `src/server/trpc/procedures.ts` — `privateProcedure` enforces `ctx.userId !== null`

## Rules

- Token is sent as `Authorization: Bearer <token>` header
- Invalid or missing token → `ctx.userId = null` (no error thrown at context level)
- `privateProcedure` throws `UNAUTHORIZED` if `ctx.userId` is null
- Use `publicProcedure` only for routes that allow unauthenticated access (booking flow, guest operations)
- No server-side sessions — stateless by design (serverless + Firebase model)
