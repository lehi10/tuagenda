/**
 * Delete Business Server Action
 *
 * Deletes a business from the database.
 * This is used when removing a business from the dashboard.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business
 */

"use server";

import { z } from "zod";
import { DeleteBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const deleteBusinessSchema = z.object({
  id: z.string().uuid("Business ID must be a valid UUID"),
});

export type DeleteBusinessInput = z.infer<typeof deleteBusinessSchema>;

type DeleteBusinessResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Deletes a business from the database
 *
 * @param input - Input with business ID to delete
 * @returns Result object indicating success or error message
 */
export async function deleteBusiness(
  input: unknown
): Promise<DeleteBusinessResult> {
  return validatePrivateAction(
    deleteBusinessSchema,
    input,
    async (validated) => {
      const businessRepository = new PrismaBusinessRepository();
      const deleteBusinessUseCase = new DeleteBusinessUseCase(
        businessRepository
      );
      const result = await deleteBusinessUseCase.execute({ id: validated.id });

      if (result.success) {
        return { success: true };
      }

      return {
        success: false,
        error: result.error || "Failed to delete business",
      };
    },
    { errorMessage: "An unexpected error occurred while deleting the business" }
  );
}
