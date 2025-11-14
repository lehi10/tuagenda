/**
 * Update BusinessUser Server Action
 *
 * This server action handles updating an existing business-user relationship.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business-user
 */

"use server";

import { z } from "zod";
import { BusinessUserProps, BusinessRole } from "@/server/core/domain/entities";
import { UpdateBusinessUserUseCase } from "@/server/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/server/infrastructure/repositories";
import { validatePrivateAction } from "@/server/lib/utils/action-validator";

// Schema validation
const updateBusinessUserSchema = z.object({
  id: z.string().uuid("Business User ID must be a valid UUID"),
  role: z.nativeEnum(BusinessRole),
});

export type UpdateBusinessUserInput = z.infer<typeof updateBusinessUserSchema>;

type UpdateBusinessUserResult =
  | { success: true; businessUser: BusinessUserProps }
  | { success: false; error: string };

/**
 * Updates an existing business-user relationship (mainly the role)
 *
 * @param input - Business-user relationship update data
 * @returns Result object with success status and updated business-user data or error message
 */
export async function updateBusinessUser(
  input: unknown
): Promise<UpdateBusinessUserResult> {
  return validatePrivateAction(
    updateBusinessUserSchema,
    input,
    async (validated) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const updateBusinessUserUseCase = new UpdateBusinessUserUseCase(
        businessUserRepository
      );

      const result = await updateBusinessUserUseCase.execute(validated);

      if (result.success && result.businessUser) {
        return {
          success: true,
          businessUser: result.businessUser.toObject(),
        };
      }

      return {
        success: false,
        error: result.error || "Failed to update business-user relationship",
      };
    },
    {
      errorMessage: "An unexpected error occurred while updating business-user",
    }
  );
}
