/**
 * Update User Server Action
 *
 * Updates user profile information in PostgreSQL database.
 * Used for updating personal information from the profile page.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import { UpdateUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const updateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthday: z.date().nullable().optional(),
  phone: z.string().nullable().optional(),
  countryCode: z.string().nullable().optional(),
  timeZone: z.string().nullable().optional(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserSchema>;

type UpdateUserResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Updates user profile personal information in database
 *
 * @param input - Input with userId and profile data to update
 * @returns Result object with success status or error message
 */
export async function updateUserProfileAction(
  input: unknown
): Promise<UpdateUserResult> {
  return validatePrivateAction(
    updateUserSchema,
    input,
    async (validated) => {
      const userRepository = new PrismaUserRepository();
      const updateUserUseCase = new UpdateUserUseCase(userRepository);

      const updateInput = {
        id: validated.userId,
        firstName: validated.firstName,
        lastName: validated.lastName,
        birthday: validated.birthday || null,
        phone: validated.phone || null,
        countryCode: validated.countryCode || null,
        timeZone: validated.timeZone || null,
      };

      const result = await updateUserUseCase.execute(updateInput);

      if (result.success) {
        return {
          success: true,
          message: "Profile updated successfully",
        };
      }

      return {
        success: false,
        error: result.error || "Failed to update profile",
      };
    },
    { errorMessage: "An unexpected error occurred while updating profile" }
  );
}
