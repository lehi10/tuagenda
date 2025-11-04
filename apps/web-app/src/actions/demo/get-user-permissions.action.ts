/**
 * DEMO ONLY - Get User Permissions
 *
 * This is a POC/Demo server action to fetch all permissions for the current user.
 * This file is isolated and can be safely deleted without affecting other code.
 */

"use server";

import { getAuthorizationService } from "@/lib/auth/authorization";
import { getAuthService } from "@/lib/auth/auth-service";
import { Resource, Action } from "auth";
import { logger } from "@/lib/logger";
import { prisma } from "db";

export interface UserPermissionInfo {
  userId: string;
  email: string | null;
  displayName: string | null;
  businesses: BusinessPermissionInfo[];
  userType?: string;
}

export interface BusinessPermissionInfo {
  businessId: string;
  businessName: string;
  roles: string[];
  permissions: PermissionCheck[];
}

export interface PermissionCheck {
  resource: string;
  action: string;
  allowed: boolean;
}

/**
 * Get all permissions for the current user across all businesses
 */
export async function getUserPermissions(): Promise<UserPermissionInfo | null> {
  try {
    // Get current user
    const authServiceInstance = getAuthService();
    const currentUser = await authServiceInstance.getCurrentUser();

    if (!currentUser?.uid) {
      logger.warn("GetUserPermissionsDemo", "system", "No authenticated user");
      return null;
    }

    const userId = currentUser.uid;

    logger.info(
      "GetUserPermissionsDemo",
      userId,
      "Fetching all permissions for user"
    );

    // Get user's businesses from database
    const businessUsers = await prisma.businessUser.findMany({
      where: {
        userId,
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Get authorization service
    const authService = getAuthorizationService();

    // Get all possible resources and actions
    const resources = Object.values(Resource);
    const actions = Object.values(Action);

    // Check permissions for each business
    const businesses: BusinessPermissionInfo[] = await Promise.all(
      businessUsers.map(async (bu) => {
        const businessId = bu.business.id.toString();

        // Get user's roles in this business
        const roles = await authService.getRolesForUser(userId, businessId);

        // Check all resource-action combinations
        const permissions: PermissionCheck[] = await Promise.all(
          resources.flatMap((resource) =>
            actions.map(async (action) => {
              const allowed = await authService.can({
                userId,
                businessId,
                resource,
                action,
              });

              return {
                resource,
                action,
                allowed,
              };
            })
          )
        );

        return {
          businessId,
          businessName: bu.business.name,
          roles,
          permissions: permissions.sort((a, b) => {
            if (a.resource === b.resource) {
              return a.action.localeCompare(b.action);
            }
            return a.resource.localeCompare(b.resource);
          }),
        };
      })
    );

    // Get user type if exists
    let userType: string | undefined;
    try {
      const userTypes = await authService.getUserTypes(userId);
      userType = userTypes.length > 0 ? userTypes.join(", ") : undefined;
    } catch (error) {
      logger.warn(
        "GetUserPermissionsDemo",
        userId,
        "Could not fetch user types"
      );
    }

    return {
      userId,
      email: currentUser.email || null,
      displayName: currentUser.displayName || null,
      businesses,
      userType,
    };
  } catch (error) {
    logger.error(
      "GetUserPermissionsDemo",
      "system",
      `Error fetching user permissions: ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}
