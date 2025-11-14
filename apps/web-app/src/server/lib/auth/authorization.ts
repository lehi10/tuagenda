/**
 * Authorization Service Wrapper for Web App
 *
 * This module provides a singleton instance of the AuthorizationService
 * from the auth package to be used throughout the web application.
 */

import { AuthorizationService, Role, UserType } from "auth";
import { prisma } from "db";

// Create singleton instance
let authService: AuthorizationService | null = null;

/**
 * Get the AuthorizationService instance
 * @returns {AuthorizationService} The authorization service instance
 */
export function getAuthorizationService(): AuthorizationService {
  if (!authService) {
    authService = AuthorizationService.getInstance(prisma);
  }
  return authService;
}

/**
 * Initialize default policies if needed
 * This should be called on app startup or during setup
 */
export async function initializeAuthorizationPolicies(): Promise<void> {
  const service = getAuthorizationService();

  try {
    // Check if policies exist by trying to get roles for a dummy business
    const roles = await service.getUsersForRoleInBusiness(
      Role.MANAGER,
      "dummy"
    );

    // If no error and empty result, we might need to initialize
    if (roles.length === 0) {
      console.log("Initializing default authorization policies...");
      await service.initializeDefaultPolicies();
      console.log("Default authorization policies initialized successfully");
    }
  } catch (error) {
    console.error("Error checking/initializing authorization policies:", error);
  }
}

/**
 * Sync user role with authorization service
 * Called when creating or updating BusinessUser relationships
 */
export async function syncUserRole(
  userId: string,
  role: "MANAGER" | "EMPLOYEE",
  businessId: string,
  operation: "add" | "remove" | "update",
  oldRole?: "MANAGER" | "EMPLOYEE"
): Promise<boolean> {
  const service = getAuthorizationService();

  try {
    switch (operation) {
      case "add":
        return await service.assignRole(
          userId,
          role as Role,
          businessId.toString()
        );

      case "remove":
        return await service.removeRole(
          userId,
          role as Role,
          businessId.toString()
        );

      case "update":
        if (!oldRole) {
          throw new Error("Old role required for update operation");
        }
        return await service.updateRole(
          userId,
          oldRole as Role,
          role as Role,
          businessId.toString()
        );

      default:
        throw new Error(`Invalid operation: ${operation}`);
    }
  } catch (error) {
    console.error(`Error syncing user role: ${error}`);
    return false;
  }
}

/**
 * Sync user type with authorization service
 * Called when promoting users to admin or superadmin
 */
export async function syncUserType(
  userId: string,
  userType: "admin" | "customer" | "superadmin",
  operation: "add" | "remove"
): Promise<boolean> {
  const service = getAuthorizationService();

  try {
    if (operation === "add") {
      return await service.assignUserType(userId, userType as UserType);
    } else {
      return await service.removeUserType(userId, userType as UserType);
    }
  } catch (error) {
    console.error(`Error syncing user type: ${error}`);
    return false;
  }
}

/**
 * Check if a user can perform an action on a resource in a business
 */
export async function canUserPerform(
  userId: string,
  businessId: string | number,
  resource: string,
  action: string
): Promise<boolean> {
  const service = getAuthorizationService();

  try {
    return await service.can({
      userId,
      businessId: businessId.toString(),
      resource,
      action,
    });
  } catch (error) {
    console.error(`Error checking permission: ${error}`);
    return false;
  }
}
