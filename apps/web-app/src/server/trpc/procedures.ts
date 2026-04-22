import { t } from "./trpc";
import { isAuthenticated } from "./middlewares/auth.middleware";
import { requireBusinessAccess } from "./middlewares/business-access.middleware";

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure;

/**
 * Private procedure - requires authentication
 * Automatically validates Firebase token and provides userId in context
 */
export const privateProcedure = t.procedure.use(isAuthenticated);

/**
 * Business member procedure - requires authentication AND membership in the target business
 * Input must include `businessId: string`
 * Superadmins bypass the membership check
 */
export const businessMemberProcedure = t.procedure
  .use(isAuthenticated)
  .use(requireBusinessAccess);
