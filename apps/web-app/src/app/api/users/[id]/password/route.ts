/**
 * Change Password API Route
 * POST /api/users/[id]/password - Change user password
 */

import { getAuthService } from "@/lib/auth/auth-service";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/user.schema";
import { logger } from "@/lib/logger";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  logger.info("CHANGE_PASSWORD", params.id, "Starting password change");

  try {
    const data: ChangePasswordInput = await request.json();

    // Validate input data
    const validatedData = changePasswordSchema.parse(data);
    logger.info("CHANGE_PASSWORD", params.id, "Data validated successfully");

    // Get auth service
    const authService = getAuthService();

    // Check if user is authenticated
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      logger.error("CHANGE_PASSWORD", params.id, "No user authenticated");
      return Response.json(
        {
          success: false,
          error: "You must be signed in to change your password",
        },
        { status: 401 }
      );
    }

    // Change password in Firebase (this includes re-authentication)
    if (typeof authService.changePassword === "function") {
      await authService.changePassword(
        validatedData.currentPassword,
        validatedData.newPassword
      );

      logger.info(
        "CHANGE_PASSWORD",
        currentUser.uid,
        "Password changed successfully"
      );

      return Response.json({
        success: true,
        message: "Password changed successfully",
      });
    } else {
      logger.error(
        "CHANGE_PASSWORD",
        currentUser.uid,
        "changePassword method not available on auth service"
      );
      return Response.json(
        {
          success: false,
          error: "Password change is not supported",
        },
        { status: 501 }
      );
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      logger.error(
        "CHANGE_PASSWORD",
        params.id,
        `Validation error: ${error.message}`
      );
      return Response.json(
        {
          success: false,
          error: "Invalid data provided. Please check your input.",
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      logger.error(
        "CHANGE_PASSWORD",
        params.id,
        `Error changing password: ${error.message}`
      );

      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    logger.error("CHANGE_PASSWORD", params.id, `Unknown error: ${String(error)}`);

    return Response.json(
      {
        success: false,
        error: "Failed to change password. Please try again.",
      },
      { status: 500 }
    );
  }
}
