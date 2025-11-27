/**
 * Server-side tRPC Caller
 *
 * This module provides a way to call tRPC procedures directly from Server Components
 * without going through HTTP. This is the proper way to use tRPC in RSC.
 *
 * Usage:
 * ```ts
 * import { api } from "@/server/trpc/server";
 *
 * // In a Server Component
 * const business = await api.business.getBySlug({ slug: "my-business" });
 * ```
 */

import "server-only";
import { cache } from "react";
import { appRouter } from "./routers/app.router";
import type { Context } from "./trpc";

/**
 * Creates a server-side context for tRPC calls
 * For public procedures, we don't need authentication
 * For private procedures, you would need to get the session here
 */
const createServerContext = cache((): Context => {
  return {
    userId: null,
    userEmail: null,
  };
});

/**
 * Server-side tRPC caller
 * Use this in Server Components to call tRPC procedures directly
 */
export const serverTrpc = appRouter.createCaller(createServerContext());
