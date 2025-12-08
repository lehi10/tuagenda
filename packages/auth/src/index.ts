/**
 * Auth Package
 *
 * Provides authorization services for RBAC with multi-tenancy.
 */

export { AuthorizationService } from "./authorization-service";
export { Resource, Action, Role, UserType } from "./types";
export type { AuthorizationRequest, PolicyRule } from "./types";
