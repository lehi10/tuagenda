/**
 * Check Permission Server Action
 *
 * This server action verifies if a user has permission to perform
 * a specific action on a resource within a business context.
 */

"use server";

import { getAuthorizationService } from "@/lib/auth/authorization";
import { getAuthService } from "@/lib/auth/auth-service";
import { Resource, Action } from "auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const checkPermissionSchema = z.object({
  businessId: z.union([z.string().min(1), z.number().int().positive()]),
  resource: z.enum(Resource),
  action: z.enum(Action),
  userId: z.string().min(1).optional(), // Optional - defaults to current user
});

export type CheckPermissionInput = z.infer<typeof checkPermissionSchema>;

export interface CheckPermissionResult {
  allowed: boolean;
  error?: string;
}

/**
 * Check if a user has permission to perform an action
 * @param input - The permission check request
 * @returns Result indicating if the action is allowed
 */
export async function checkPermission(
  input: CheckPermissionInput
): Promise<CheckPermissionResult> {
  try {
    // Validate input
    const validatedData = checkPermissionSchema.parse(input);

    // Get user ID (use provided or current user)
    const authServiceInstance = getAuthService();
    const currentUser = await authServiceInstance.getCurrentUser();
    const userId = validatedData.userId || currentUser?.uid;

    if (!userId) {
      return {
        allowed: false,
        error: "User not authenticated",
      };
    }

    logger.info(
      "CheckPermissionAction",
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
      "CheckPermissionAction",
      userId,
      `Permission check result: ${allowed ? "ALLOWED" : "DENIED"}`
    );

    return {
      allowed,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e) => e.message).join(", ");
      logger.error(
        "CheckPermissionAction",
        "system",
        `Validation error: ${errorMessage}`
      );
      return {
        allowed: false,
        error: `Validation error: ${errorMessage}`,
      };
    }

    logger.error(
      "CheckPermissionAction",
      "system",
      `Error checking permission: ${error instanceof Error ? error.message : String(error)}`
    );

    return {
      allowed: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred checking permission",
    };
  }
}
