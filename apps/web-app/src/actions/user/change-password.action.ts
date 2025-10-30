/**
 * Change Password Server Action
 *
 * Changes user password in Firebase Authentication.
 * Requires the current password for re-authentication.
 *
 * @module actions/user
 */

"use server";

import { getAuthService } from "@/lib/auth/auth-service";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/user.schema";
import { logger } from "@/lib/logger";

/**
 * Result type for the change password action
 */
type ChangePasswordResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Changes user password in Firebase Authentication
 *
 * @param data - The password change data (current, new, confirm)
 * @returns Result object with success status or error message
 *
 * @example
 * ```typescript
 * const result = await changePassword({
 *   currentPassword: 'oldPassword123',
 *   newPassword: 'newPassword456',
 *   confirmPassword: 'newPassword456'
 * });
 *
 * if (result.success) {
 *   console.log('Password changed successfully');
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function changePassword(
  data: ChangePasswordInput
): Promise<ChangePasswordResult> {
  logger.info("CHANGE_PASSWORD", "anonymous", "Starting password change");

  try {
    // Validate input data
    const validatedData = changePasswordSchema.parse(data);
    logger.info("CHANGE_PASSWORD", "anonymous", "Data validated successfully");

    // Get auth service
    const authService = getAuthService();

    // Check if user is authenticated
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      logger.error("CHANGE_PASSWORD", "anonymous", "No user authenticated");
      return {
        success: false,
        error: "You must be signed in to change your password",
      };
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

      return {
        success: true,
        message: "Password changed successfully",
      };
    } else {
      logger.error(
        "CHANGE_PASSWORD",
        currentUser.uid,
        "changePassword method not available on auth service"
      );
      return {
        success: false,
        error: "Password change is not supported",
      };
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      logger.error(
        "CHANGE_PASSWORD",
        "anonymous",
        `Validation error: ${error.message}`
      );
      return {
        success: false,
        error: "Invalid data provided. Please check your input.",
      };
    }

    if (error instanceof Error) {
      logger.error(
        "CHANGE_PASSWORD",
        "anonymous",
        `Error changing password: ${error.message}`
      );

      // Return specific error message from Firebase
      return {
        success: false,
        error: error.message,
      };
    }

    logger.error(
      "CHANGE_PASSWORD",
      "anonymous",
      `Unknown error: ${String(error)}`
    );

    return {
      success: false,
      error: "Failed to change password. Please try again.",
    };
  }
}
