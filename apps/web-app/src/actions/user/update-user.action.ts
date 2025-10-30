/**
 * Update User Server Action
 *
 * Updates user profile information in PostgreSQL database.
 * Used for updating personal information from the profile page.
 *
 * @module actions/user
 */

"use server";

import { prisma } from "@/lib/db/prisma";
import {
  updateProfilePersonalInfoSchema,
  type UpdateProfilePersonalInfoInput,
} from "@/lib/validations/user.schema";
import { logger } from "@/lib/logger";

/**
 * Result type for the update user action
 */
type UpdateUserResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Updates user profile personal information in database
 *
 * @param userId - The ID of the user to update
 * @param data - The profile data to update
 * @returns Result object with success status or error message
 *
 * @example
 * ```typescript
 * const result = await updateUserProfile(userId, {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '987654321',
 *   countryCode: '+51',
 * });
 *
 * if (result.success) {
 *   console.log('Profile updated successfully');
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateProfilePersonalInfoInput
): Promise<UpdateUserResult> {
  logger.info("UPDATE_USER", userId, "Starting profile update");

  try {
    // Validate input data
    const validatedData = updateProfilePersonalInfoSchema.parse(data);
    logger.info("UPDATE_USER", userId, "Data validated successfully");

    // Convert empty strings to null for optional fields
    const updateData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      birthday: validatedData.birthday || null,
      phone: validatedData.phone || null,
      countryCode: validatedData.countryCode || null,
      timeZone: validatedData.timeZone || null,
    };

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    logger.info(
      "UPDATE_USER",
      userId,
      `Profile updated successfully - ${updatedUser.email}`
    );

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      logger.error("UPDATE_USER", userId, `Validation error: ${error.message}`);
      return {
        success: false,
        error: "Invalid data provided. Please check your input.",
      };
    }

    logger.error(
      "UPDATE_USER",
      userId,
      `Error updating profile: ${error instanceof Error ? error.message : "Unknown error"}`
    );

    return {
      success: false,
      error: "Failed to update profile. Please try again.",
    };
  }
}
