/**
 * Authorization API Route
 * POST /api/authorization/check-permission - Check if user has permission
 *
 * NOTE: This action does NOT use hexagonal architecture.
 * It uses direct service calls (getAuthorizationService, getAuthService).
 * This could be refactored to use Use Cases if needed.
 */

import { getAuthorizationService } from "@/lib/auth/authorization";
import { getAuthService } from "@/lib/auth/auth-service";
import { Resource, Action } from "auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const checkPermissionSchema = z.object({
  businessId: z.union([z.string().min(1), z.number().int().positive()]),
  resource: z.enum(Resource),
  action: z.enum(Action),
  userId: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = checkPermissionSchema.parse(body);

    // Get user ID (use provided or current user)
    const authServiceInstance = getAuthService();
    const currentUser = await authServiceInstance.getCurrentUser();
    const userId = validatedData.userId || currentUser?.uid;

    if (!userId) {
      return Response.json(
        {
          allowed: false,
          error: "User not authenticated",
        },
        { status: 401 }
      );
    }

    logger.info(
      "API:POST /api/authorization/check-permission",
      userId,
      `Checking permission for ${validatedData.resource}.${validatedData.action} in business ${validatedData.businessId}`
    );

    // Get authorization service
    const authService = getAuthorizationService();

    // Check permission
    const allowed = await authService.can({
      userId,
      businessId: validatedData.businessId.toString(),
      resource: validatedData.resource,
      action: validatedData.action,
    });

    logger.info(
      "API:POST /api/authorization/check-permission",
      userId,
      `Permission check result: ${allowed ? "ALLOWED" : "DENIED"}`
    );

    return Response.json({
      allowed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e) => e.message).join(", ");
      logger.error(
        "API:POST /api/authorization/check-permission",
        "system",
        `Validation error: ${errorMessage}`
      );
      return Response.json(
        {
          allowed: false,
          error: `Validation error: ${errorMessage}`,
        },
        { status: 400 }
      );
    }

    logger.error(
      "API:POST /api/authorization/check-permission",
      "system",
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );

    return Response.json(
      {
        allowed: false,
        error: "An error occurred checking permission",
      },
      { status: 500 }
    );
  }
}
