/**
 * Delete User Action
 *
 * Admin action to delete a user from the system.
 * This will cascade delete related records based on schema constraints.
 *
 * @module actions/user
 */

"use server";

import { prisma } from "db";
import { logger } from "@/lib/logger";
import { z } from "zod";

const deleteUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export interface DeleteUserResult {
  success: boolean;
  error?: string;
}

/**
 * Delete a user from the system
 *
 * @param input - User ID to delete
 * @returns Result with success status
 */
export async function deleteUser(
  input: DeleteUserInput
): Promise<DeleteUserResult> {
  try {
    // Validate input
    const validatedData = deleteUserSchema.parse(input);

    logger.info(
      "DeleteUserAction",
      validatedData.userId,
      "Attempting to delete user"
    );

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      logger.warn(
        "DeleteUserAction",
        validatedData.userId,
        "User not found"
      );
      return {
        success: false,
        error: "User not found",
      };
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: validatedData.userId },
    });

    logger.info(
      "DeleteUserAction",
      validatedData.userId,
      `User deleted successfully: ${user.email} (${user.firstName} ${user.lastName})`
    );

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e) => e.message).join(", ");
      logger.error(
        "DeleteUserAction",
        "system",
        `Validation error: ${errorMessage}`
      );
      return {
        success: false,
        error: `Validation error: ${errorMessage}`,
      };
    }

    logger.error(
      "DeleteUserAction",
      "system",
      `Error deleting user: ${error instanceof Error ? error.message : String(error)}`
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred deleting user",
    };
  }
}
