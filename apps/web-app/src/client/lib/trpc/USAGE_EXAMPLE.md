# tRPC Usage Guide

## Setup

### 1. Wrap your app with TRPCProvider

Replace `QueryProvider` with `TRPCProvider` in your root layout:

```tsx
// src/app/layout.tsx
import { TRPCProvider } from "@/client/lib/trpc";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
```

## Client Usage Examples

### Public Query (No Auth Required)

```tsx
"use client";

import { trpc } from "@/client/lib/trpc";

export function HealthCheck() {
  const { data, isLoading, error } = trpc.health.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      Status: {data.status}
      <br />
      Time: {data.timestamp}
    </div>
  );
}
```

### Private Query (Auth Required)

The Firebase token is automatically included in the request headers.
No need to manually pass the token!

```tsx
"use client";

import { trpc } from "@/client/lib/trpc";

export function UserProfile() {
  // Token is automatically sent via headers (like Axios interceptor)
  const { data, isLoading, error } = trpc.me.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      User ID: {data.userId}
      <br />
      Email: {data.email}
    </div>
  );
}
```

### Private Query with Input

```tsx
"use client";

import { trpc } from "@/client/lib/trpc";

export function EchoMessage() {
  const { data } = trpc.echo.useQuery({ message: "Hello World" });

  return <div>{data?.message}</div>;
}
```

## Adding New Procedures

### 1. Add to the router (Server)

```tsx
// src/server/trpc/routers/app.router.ts
import { z } from "zod";
import { router, publicProcedure, privateProcedure } from "../trpc";

export const appRouter = router({
  // Existing procedures...

  // Add new public procedure
  getPublicData: publicProcedure.query(() => {
    return { message: "Public data" };
  }),

  // Add new private procedure with input
  updateProfile: privateProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // ctx.userId is available here (from Firebase token)
      // Call your use case here
      return { success: true, userId: ctx.userId };
    }),
});
```

### 2. Use in component (Client)

```tsx
"use client";

import { trpc } from "@/client/lib/trpc";

export function ProfileEditor() {
  const updateProfile = trpc.updateProfile.useMutation({
    onSuccess: () => {
      console.log("Profile updated!");
    },
  });

  const handleSubmit = () => {
    updateProfile.mutate({
      name: "John Doe",
      bio: "Developer",
    });
  };

  return (
    <button onClick={handleSubmit} disabled={updateProfile.isPending}>
      {updateProfile.isPending ? "Saving..." : "Save Profile"}
    </button>
  );
}
```

## Integrating with Existing Use Cases

```tsx
// src/server/trpc/routers/app.router.ts
import { GetUserUseCase } from "@/server/core/application/use-cases/user";
import { PrismaUserRepository } from "@/server/infrastructure/repositories";
import { privateProcedure } from "../trpc";

const userRepository = new PrismaUserRepository();

export const appRouter = router({
  getUser: privateProcedure.query(async ({ ctx }) => {
    const useCase = new GetUserUseCase(userRepository);
    const result = await useCase.execute({ userId: ctx.userId });

    if (!result.success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return result.user;
  }),
});
```

## Key Points

1. **Token is automatic** - Firebase ID token is sent in Authorization header automatically
2. **Type safety** - Full TypeScript support from server to client
3. **No manual token passing** - Similar to Axios interceptor pattern
4. **Reuse existing architecture** - Call your Use Cases from procedures
5. **Zod validation** - Input validation with Zod schemas
