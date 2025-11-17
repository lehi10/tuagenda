import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { verifyAuthToken } from "@/server/lib/auth/firebase/admin";

/**
 * Context type for tRPC procedures
 * Contains the authenticated user info when available
 */
export interface Context {
  userId: string | null;
  userEmail: string | null;
}

/**
 * Creates the context for each tRPC request
 * Extracts and validates the Firebase token from headers
 */
export async function createContext(opts: { req: Request }): Promise<Context> {
  const authHeader = opts.req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { userId: null, userEmail: null };
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const { uid, email } = await verifyAuthToken(token);
    return { userId: uid, userEmail: email };
  } catch {
    // Invalid token - return unauthenticated context
    return { userId: null, userEmail: null };
  }
}

/**
 * Initialize tRPC with context and superjson transformer
 * This is the core tRPC instance used to build procedures and middlewares
 */
export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

/**
 * Base router helper
 */
export const router = t.router;

/**
 * Base middleware helper
 * Use this to create custom middlewares
 */
export const middleware = t.middleware;
