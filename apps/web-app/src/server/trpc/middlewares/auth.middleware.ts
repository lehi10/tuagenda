import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

/**
 * Authentication middleware
 * Ensures the user is authenticated (has valid Firebase token)
 */
export const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      userId: ctx.userId,
      userEmail: ctx.userEmail,
    },
  });
});
