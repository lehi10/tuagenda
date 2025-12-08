/**
 * Authorization Adapter
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IAuthorizationPort interface.
 *
 * @module infrastructure/adapters
 */

import {
  IAuthorizationPort,
  AuthorizationRequest,
} from "@/server/core/domain/ports";
import { canUserPerform } from "@/server/lib/auth/authorization";

/**
 * Authorization Adapter
 *
 * Implements authorization checks.
 * This adapter bridges the domain's IAuthorizationPort with
 * the authorization service.
 */
export class AuthorizationAdapter implements IAuthorizationPort {
  /**
   * Check if a user can perform an action on a resource within a business
   *
   * @param request - Authorization request details
   * @returns true if the action is allowed, false otherwise
   */
  async canPerform(request: AuthorizationRequest): Promise<boolean> {
    return canUserPerform(
      request.userId,
      request.businessId,
      request.resource,
      request.action
    );
  }
}
