/**
 * Update User Admin Action
 *
 * Admin action to update user type and status.
 * This is separate from updateUserProfileAction which only handles personal info.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import { UpdateUserAdminUseCase } from "@/core/application/use-cases/user";
import { UserType, UserStatus } from "@/core/domain/entities/User";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const updateUserAdminSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.enum(UserType).optional(),
  status: z.enum(UserStatus).optional(),
});

export interface UpdateUserAdminResult {
  success: boolean;
  error?: string;
}

/**
 * Update user type and/or status (Admin only)
 *
 * @param input - Input with userId and fields to update
 * @returns Result with success status
 */
export async function updateUserAdmin(
  input: unknown
): Promise<UpdateUserAdminResult> {
  return validatePrivateAction(
    updateUserAdminSchema,
    input,
    async (validated) => {
      const userRepository = new PrismaUserRepository();
      const updateUserAdminUseCase = new UpdateUserAdminUseCase(userRepository);

      const result = await updateUserAdminUseCase.execute({
        id: validated.userId,
        type: validated.type,
        status: validated.status,
      });

      return {
        success: result.success,
        error: result.error,
      };
    },
    { errorMessage: "An unexpected error occurred while updating user" }
  );
}
