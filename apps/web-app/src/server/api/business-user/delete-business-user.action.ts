/**
 * Delete BusinessUser Server Action
 *
 * This server action handles deleting a business-user relationship.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business-user
 */

"use server";

import { z } from "zod";
import { DeleteBusinessUserUseCase } from "@/server/core/application/use-cases/business-user";
import {
  PrismaBusinessUserRepository,
  PrismaUserRepository,
} from "@/server/infrastructure/repositories";
import { validatePrivateAction } from "@/server/lib/utils/action-validator";

// Schema validation
const deleteBusinessUserSchema = z.object({
  id: z.string().uuid("Business User ID must be a valid UUID"),
});

export type DeleteBusinessUserInput = z.infer<typeof deleteBusinessUserSchema>;

type DeleteBusinessUserResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Deletes a business-user relationship
 *
 * @param input - Business-user relationship ID
 * @returns Result object with success status or error message
 */
export async function deleteBusinessUser(
  input: unknown
): Promise<DeleteBusinessUserResult> {
  return validatePrivateAction(
    deleteBusinessUserSchema,
    input,
    async (validated) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const userRepository = new PrismaUserRepository();
      const deleteBusinessUserUseCase = new DeleteBusinessUserUseCase(
        businessUserRepository,
        userRepository
      );

      const result = await deleteBusinessUserUseCase.execute(validated);

      if (result.success) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to delete business-user relationship",
      };
    },
    {
      errorMessage: "An unexpected error occurred while deleting business-user",
    }
  );
}
