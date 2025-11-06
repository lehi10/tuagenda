/**
 * Demo API Route
 * POST /api/demo/user-claims - Get all permissions/claims for a user
 *
 * NOTE: This action does NOT use hexagonal architecture.
 * It uses direct service calls and Prisma.
 * This should be refactored to use Use Cases if it becomes a core feature.
 */

import { getAuthorizationService } from "@/lib/auth/authorization";
import { Resource, Action } from "auth";
import { logger } from "@/lib/logger";
import { prisma } from "db";
import { User } from "@/lib/auth/types";

export async function POST(request: Request) {
  try {
    const user: User = await request.json();

    if (!user.id) {
      logger.error(
        "API:POST /api/demo/user-claims",
        "system",
        "No userId provided"
      );
      return Response.json(
        {
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    logger.info(
      "API:POST /api/demo/user-claims",
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
    const businesses = await Promise.all(
      businessUsers.map(async (bu) => {
        const businessId = bu.business.id.toString();

        // Get user's roles in this business
        const roles = await authService.getRolesForUserInBusiness(
          user.id,
          businessId
        );

        // Check all resource-action combinations
        const permissions = await Promise.all(
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
        "API:POST /api/demo/user-claims",
        user.id,
        "Could not fetch user types"
      );
    }

    return Response.json({
      userId: user.id,
      email: user.firstName || null,
      displayName: user.lastName || null,
      businesses,
      userType,
    });
  } catch (error) {
    logger.error(
      "API:POST /api/demo/user-claims",
      "system",
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    return Response.json(
      {
        error: "An error occurred fetching user permissions",
      },
      { status: 500 }
    );
  }
}
