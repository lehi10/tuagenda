/**
 * Delete BusinessUser Server Action
 *
 * This server action handles deleting a business-user relationship.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business-user
 */

"use server";

import { z } from "zod";
import {
  DeleteBusinessUserUseCase,
  DeleteBusinessUserInput,
} from "@/core/application/use-cases/business-user";
import {
  PrismaBusinessUserRepository,
  PrismaUserRepository,
} from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const deleteBusinessUserSchema = z.object({
  id: z.number(),
});

export type DeleteBusinessUserActionInput = z.infer<typeof deleteBusinessUserSchema>;

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

      const data: DeleteBusinessUserInput = validated;
      const result = await deleteBusinessUserUseCase.execute(data);

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
    { errorMessage: "An unexpected error occurred while deleting business-user" }
  );
}
