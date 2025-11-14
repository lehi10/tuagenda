/**
 * Delete User Action
 *
 * Admin action to delete a user from the system.
 * This will cascade delete related records based on schema constraints.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import { DeleteUserUseCase } from "@/server/core/application/use-cases/user";
import type { DeleteUserResult } from "@/server/core/application/use-cases/user";
import { PrismaUserRepository } from "@/server/infrastructure/repositories";
import { validatePrivateAction } from "@/server/lib/utils/action-validator";

// Schema validation
const deleteUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

/**
 * Delete a user from the system
 *
 * @param input - User ID to delete
 * @returns Result with success status
 */
export async function deleteUser(input: unknown): Promise<DeleteUserResult> {
  return validatePrivateAction(
    deleteUserSchema,
    input,
    async (validated) => {
      const userRepository = new PrismaUserRepository();
      const deleteUserUseCase = new DeleteUserUseCase(userRepository);
      const result = await deleteUserUseCase.execute({ id: validated.userId });

      return {
        success: result.success,
        error: result.error,
      };
    },
    { errorMessage: "An unexpected error occurred while deleting user" }
  );
}
