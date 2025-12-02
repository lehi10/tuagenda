/**
 * Authorization Port Interface
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for authorization checks without specifying implementation.
 * The infrastructure layer will provide concrete implementations (adapters).
 *
 * Note: This is a PORT (not a Repository) because it abstracts a SERVICE
 * (permission checking), not entity persistence. The fact that Casbin
 * uses the database is an implementation detail.
 *
 * @module core/domain/ports
 */

import { Resource, Action } from "auth";

/**
 * Request to check if a user can perform an action
 */
export interface AuthorizationRequest {
  /** User ID (Firebase UID) */
  userId: string;
  /** Business ID (domain/tenant) */
  businessId: string;
  /** Resource to access */
  resource: Resource;
  /** Action to perform */
  action: Action;
}

/**
 * Authorization Port
 *
 * Defines the contract for checking user permissions.
 * This port is consumed by Use Cases to verify authorization
 * before executing business logic.
 *
 * @example
 * ```typescript
 * class DeleteBusinessUseCase {
 *   constructor(private authPort: IAuthorizationPort) {}
 *
 *   async execute(userId: string, businessId: string) {
 *     const allowed = await this.authPort.canPerform({
 *       userId,
 *       businessId,
 *       resource: Resource.BUSINESS,
 *       action: Action.DELETE
 *     });
 *
 *     if (!allowed) throw new Error("Forbidden");
 *     // ... continue with business logic
 *   }
 * }
 * ```
 */
export interface IAuthorizationPort {
  /**
   * Check if a user can perform an action on a resource within a business
   * @param request - Authorization request details
   * @returns true if the action is allowed, false otherwise
   */
  canPerform(request: AuthorizationRequest): Promise<boolean>;
}
