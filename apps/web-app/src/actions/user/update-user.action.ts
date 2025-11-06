/**
 * Update User Server Action
 *
 * Updates user profile information in PostgreSQL database.
 * Used for updating personal information from the profile page.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/user
 */

"use server";

import {
  updateProfilePersonalInfoSchema,
  type UpdateProfilePersonalInfoInput,
} from "@/lib/validations/user.schema";
import { logger } from "@/lib/logger";
import { UpdateUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";

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

    // Dependency injection: Create repository and use case
    const userRepository = new PrismaUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);

    // Convert empty strings to null for optional fields
    const updateInput = {
      id: userId,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      birthday: validatedData.birthday || null,
      phone: validatedData.phone || null,
      countryCode: validatedData.countryCode || null,
      timeZone: validatedData.timeZone || null,
    };

    // Execute use case
    const result = await updateUserUseCase.execute(updateInput);

    if (result.success) {
      logger.info(
        "UPDATE_USER",
        userId,
        `Profile updated successfully - ${result.user.email}`
      );

      return {
        success: true,
        message: "Profile updated successfully",
      };
    }

    logger.error("UPDATE_USER", userId, `Update failed: ${result.error}`);
    return {
      success: false,
      error: result.error,
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
