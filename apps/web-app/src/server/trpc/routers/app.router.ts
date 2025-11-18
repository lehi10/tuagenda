import { router } from "../trpc";
import { publicProcedure } from "../procedures";
import { userRouter } from "./user.router";
import { businessRouter } from "./business.router";
import { businessUserRouter } from "./businessUser.router";
import { serviceCategoryRouter } from "./serviceCategory.router";
import { serviceRouter } from "./service.router";
import { employeeServiceRouter } from "./employeeService.router";
import { employeeAvailabilityRouter } from "./employeeAvailability.router";
import { employeeExceptionRouter } from "./employeeException.router";

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

  /**
   * ServiceCategory domain procedures
   * Access: trpc.serviceCategory.create, trpc.serviceCategory.list, etc.
   */
  serviceCategory: serviceCategoryRouter,

  /**
   * Service domain procedures
   * Access: trpc.service.create, trpc.service.list, etc.
   */
  service: serviceRouter,

  /**
   * EmployeeService domain procedures
   * Access: trpc.employeeService.assign, trpc.employeeService.getByEmployee, etc.
   */
  employeeService: employeeServiceRouter,

  /**
   * EmployeeAvailability domain procedures
   * Access: trpc.employeeAvailability.getByEmployee, trpc.employeeAvailability.create, etc.
   */
  employeeAvailability: employeeAvailabilityRouter,

  /**
   * EmployeeException domain procedures
   * Access: trpc.employeeException.getByEmployee, trpc.employeeException.create, etc.
   */
  employeeException: employeeExceptionRouter,

  // Future routers:
  // appointment: appointmentRouter,
});

/**
 * Type definition for the app router
 * Used by the client to get type safety
 */
export type AppRouter = typeof appRouter;
