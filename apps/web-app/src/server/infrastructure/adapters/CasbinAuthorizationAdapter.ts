/**
 * Casbin Authorization Adapter
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IAuthorizationPort interface using Casbin
 * as the underlying authorization engine.
 *
 * @module infrastructure/adapters
 */

import {
  IAuthorizationPort,
  AuthorizationRequest,
} from "@/server/core/domain/ports";
import { canUserPerform } from "@/server/lib/auth/authorization";

/**
 * Casbin Authorization Adapter
 *
 * Implements authorization checks using the Casbin library.
 * This adapter bridges the domain's IAuthorizationPort with
 * the Casbin authorization service.
 */
export class CasbinAuthorizationAdapter implements IAuthorizationPort {
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
