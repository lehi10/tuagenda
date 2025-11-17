import { t } from "./trpc";
import { isAuthenticated } from "./middlewares/auth.middleware";

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure;

/**
 * Private procedure - requires authentication
 * Automatically validates Firebase token and provides userId in context
 */
export const privateProcedure = t.procedure.use(isAuthenticated);
