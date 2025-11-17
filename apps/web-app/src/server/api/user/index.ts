/**
 * User Actions
 *
 * Public API for user-related server actions
 * Note: Most user actions have been migrated to tRPC (src/server/trpc/routers/user.router.ts)
 */

// Only changePasswordAction remains as it uses client-side Firebase Auth
export { changePasswordAction } from "./change-password.action";
