/**
 * Update User Admin Action
 *
 * Admin action to update user type and status.
 * This is separate from updateUserProfile which only handles personal info.
 *
 * @module actions/user
 */

"use server";

import { prisma } from "db";
import { logger } from "@/lib/logger";
import { UserType, UserStatus } from "@/core/domain/entities/User";
import { z } from "zod";

const updateUserAdminSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.nativeEnum(UserType).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;

export interface UpdateUserAdminResult {
  success: boolean;
  error?: string;
}

/**
 * Update user type and/or status (Admin only)
 *
 * @param input - User ID and fields to update
 * @returns Result with success status
 */
export async function updateUserAdmin(
  input: UpdateUserAdminInput
): Promise<UpdateUserAdminResult> {
  try {
    // Validate input
    const validatedData = updateUserAdminSchema.parse(input);

    logger.info(
      "UpdateUserAdminAction",
      validatedData.userId,
      `Updating user admin fields: type=${validatedData.type}, status=${validatedData.status}`
    );

    // Build update data
    const updateData: any = {};

    if (validatedData.type !== undefined) {
      updateData.type = validatedData.type;
    }

    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: "No fields to update",
      };
    }

    // Update user
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: updateData,
    });

    logger.info(
      "UpdateUserAdminAction",
      validatedData.userId,
      "User updated successfully"
    );

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e) => e.message).join(", ");
      logger.error(
        "UpdateUserAdminAction",
        "system",
        `Validation error: ${errorMessage}`
      );
      return {
        success: false,
        error: `Validation error: ${errorMessage}`,
      };
    }

    logger.error(
      "UpdateUserAdminAction",
      "system",
      `Error updating user: ${error instanceof Error ? error.message : String(error)}`
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred updating user",
    };
  }
}
