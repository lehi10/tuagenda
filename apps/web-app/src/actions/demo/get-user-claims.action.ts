/**
 * Get User Claims (Permissions)
 *
 * Server action to fetch all permissions/claims for a user.
 */

"use server";

import { getAuthorizationService } from "@/lib/auth/authorization";
import { Resource, Action } from "auth";
import { logger } from "@/lib/logger";
import { prisma } from "db";
import { User } from "@/lib/auth/types";

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
 * Get all permissions/claims for a specific user across all businesses
 */
export async function getUserClaims(
  user: User
): Promise<UserPermissionInfo | null> {
  try {
    if (!user.id) {
      logger.error("GetUserClaims", "system", "No userId provided");
      return null;
    }

    console.log("[getUserClaims] Fetching claims for userId:", user.id);

    logger.info(
      "GetUserPermissionsDemo",
      user.id,
      "Fetching all permissions for user"
    );

    // Get user's businesses from database
    const businessUsers = await prisma.businessUser.findMany({
      where: {
        userId: user.id,
      },
      include: {
        business: {
          select: {
            id: true,
            title: true,
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
        const roles = await authService.getRolesForUserInBusiness(
          user.id,
          businessId
        );

        // Check all resource-action combinations
        const permissions: PermissionCheck[] = await Promise.all(
          resources.flatMap((resource) =>
            actions.map(async (action) => {
              const allowed = await authService.can({
                userId: user.id,
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
          businessName: bu.business.title,
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
      const userTypes = await authService.getUserTypes(user.id);
      userType = userTypes.length > 0 ? userTypes.join(", ") : undefined;
    } catch (error) {
      logger.warning(
        "GetUserPermissionsDemo",
        user.id,
        "Could not fetch user types"
      );
    }

    return {
      userId: user.id,
      email: user.firstName || null,
      displayName: user.lastName || null,
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
