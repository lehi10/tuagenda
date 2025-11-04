/**
 * Auth Package
 *
 * Provides authorization services using Casbin for RBAC with multi-tenancy.
 */

export { AuthorizationService } from "./authorization-service";
export { PrismaAdapter } from "./casbin/prisma-adapter";
export { Resource, Action, Role, UserType } from "./types";
export type { AuthorizationRequest, PolicyRule } from "./types";
