# tRPC Clients

There are three ways to call tRPC procedures — use the right one for each context.

## The three clients

```typescript
// 1. useTrpc — React hooks, inside Client Components ("use client")
import { useTrpc } from "@/client/lib/trpc";

const { data, isLoading } = useTrpc.user.me.useQuery();
const mutation = useTrpc.user.updateProfile.useMutation();

// 2. trpc — imperative, outside React components (contexts, event handlers, utils)
import { trpc } from "@/client/lib/trpc";

const user = await trpc.user.me.query();
const result = await trpc.user.create.mutate({ ... });

// 3. serverTrpc — Server Components only, calls procedures directly without HTTP
import { serverTrpc } from "@/server/trpc/server";

const business = await serverTrpc.business.getBySlug({ slug: "my-business" });
```

## When to use each

| Context | Client |
|---------|--------|
| React Client Component | `useTrpc` |
| Event handler / context / utility | `trpc` |
| Next.js Server Component | `serverTrpc` |

## Rules

- `serverTrpc` context has `userId: null` — only use it for `publicProcedure` calls
- Never use `useTrpc` outside a React component — hooks can only be called inside components
- Never use `serverTrpc` in Client Components — it imports `server-only`
- Both `useTrpc` and `trpc` auto-attach the Firebase token via Bearer header
