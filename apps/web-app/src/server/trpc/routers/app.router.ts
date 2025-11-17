import { router } from "../trpc";
import { publicProcedure } from "../procedures";
import { userRouter } from "./user.router";
import { businessRouter } from "./business.router";
import { businessUserRouter } from "./businessUser.router";

/**
 * Main application router
 * Combines all domain-specific routers
 *
 * Structure:
 * - user.*     -> User procedures (getById, me, etc.)
 * - business.* -> Business procedures (future)
 * - etc.
 */
export const appRouter = router({
  /**
   * Health check - public procedure
   */
  health: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),

  /**
   * User domain procedures
   * Access: trpc.user.getById, trpc.user.me, etc.
   */
  user: userRouter,

  /**
   * Business domain procedures
   * Access: trpc.business.getById, trpc.business.list, etc.
   */
  business: businessRouter,

  /**
   * BusinessUser domain procedures
   * Access: trpc.businessUser.create, trpc.businessUser.getByBusiness, etc.
   */
  businessUser: businessUserRouter,

  // Future routers:
  // appointment: appointmentRouter,
  // service: serviceRouter,
});

/**
 * Type definition for the app router
 * Used by the client to get type safety
 */
export type AppRouter = typeof appRouter;
