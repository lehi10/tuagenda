import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { prisma } from "db";

/**
 * Business access middleware
 *
 * Verifies that the authenticated user has access to the requested business.
 * Reads `businessId` from `ctx.businessId` (injected from the `x-business-id` header in createContext).
 *
 * Allows access when:
 * - The user has a business_user record for the businessId (any role), OR
 * - The user is a superadmin (user.type = 'superadmin')
 *
 * Throws FORBIDDEN otherwise.
 */
export const requireBusinessAccess = middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  const businessId = ctx.businessId;

  if (!businessId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "x-business-id header is required",
    });
  }

  // Check superadmin first (single DB read on user table)
  const user = await prisma.user.findUnique({
    where: { id: ctx.userId },
    select: { type: true },
  });

  if (user?.type === "superadmin") {
    return next({ ctx: { ...ctx, businessId } });
  }

  // Check business membership
  const membership = await prisma.businessUser.findFirst({
    where: {
      userId: ctx.userId,
      businessId,
      isActive: true,
    },
    select: { id: true },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this business",
    });
  }

  return next({ ctx: { ...ctx, businessId } });
});
