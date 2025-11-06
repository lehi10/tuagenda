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
import { syncUserType } from "@/lib/auth/authorization";
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
    console.log("updateUserAdmin called with:", input);

    // Validate input
    const validatedData = updateUserAdminSchema.parse(input);

    console.log("Validated data:", validatedData);

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

    // Get current user data if type is being updated
    let oldUserType: UserType | undefined;
    if (validatedData.type !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: validatedData.userId },
        select: { type: true },
      });
      oldUserType = currentUser?.type as UserType;
    }

    // Update user in database
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: updateData,
    });

    // Sync user type with authorization system if type changed
    if (
      validatedData.type !== undefined &&
      oldUserType !== validatedData.type
    ) {
      logger.info(
        "UpdateUserAdminAction",
        validatedData.userId,
        `Syncing user type change: ${oldUserType} -> ${validatedData.type}`
      );

      // Remove old user type from authorization system (if not customer)
      if (oldUserType && oldUserType !== UserType.CUSTOMER) {
        console.log(`Removing old user type: ${oldUserType}`);
        const removed = await syncUserType(
          validatedData.userId,
          oldUserType === UserType.ADMIN ? "admin" : "superadmin",
          "remove"
        );
        console.log(`Old user type removed: ${removed}`);
      }

      // Add new user type to authorization system (if not customer)
      if (validatedData.type !== UserType.CUSTOMER) {
        console.log(`Adding new user type: ${validatedData.type}`);
        const synced = await syncUserType(
          validatedData.userId,
          validatedData.type === UserType.ADMIN ? "admin" : "superadmin",
          "add"
        );
        console.log(`New user type synced: ${synced}`);

        if (!synced) {
          logger.error(
            "UpdateUserAdminAction",
            validatedData.userId,
            "Failed to sync user type with authorization service"
          );
        }
      }
    }

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
