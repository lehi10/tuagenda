/**
 * Change Password Server Action
 *
 * Changes user password in Firebase Authentication.
 * Requires the current password for re-authentication.
 *
 * REFACTORED: Added Zod validation for input data.
 * Validation happens here, auth service receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import { getAuthService } from "@/lib/auth/auth-service";
import { validateAndExecute } from "@/lib/utils/action-validator";

// Schema validation
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

type ChangePasswordResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Changes user password in Firebase Authentication
 *
 * @param input - The password change data (current, new, confirm)
 * @returns Result object with success status or error message
 */
export async function changePasswordAction(
  input: unknown
): Promise<ChangePasswordResult> {
  return validateAndExecute(
    changePasswordSchema,
    input,
    async (validated) => {
      const authService = getAuthService();

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: "You must be signed in to change your password",
        };
      }

      if (typeof authService.changePassword === "function") {
        try {
          await authService.changePassword(
            validated.currentPassword,
            validated.newPassword
          );
          return {
            success: true,
            message: "Password changed successfully",
          };
        } catch (error) {
          if (error instanceof Error) {
            return {
              success: false,
              error: error.message,
            };
          }
          throw error;
        }
      } else {
        return {
          success: false,
          error: "Password change is not supported",
        };
      }
    },
    { errorMessage: "Failed to change password. Please try again." }
  );
}
