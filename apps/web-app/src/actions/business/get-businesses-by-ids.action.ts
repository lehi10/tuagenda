/**
 * Get Businesses By IDs Server Action
 *
 * This server action handles retrieving multiple businesses by their IDs.
 * It uses hexagonal architecture with use cases.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business
 */

"use server";

import { z } from "zod";
import { BusinessProps } from "@/core/domain/entities";
import { GetBusinessesByIdsUseCase } from "@/core/application/use-cases/business/GetBusinessesByIds";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const getBusinessesByIdsSchema = z.object({
  ids: z
    .array(z.number().int().positive())
    .min(1, "At least one ID is required"),
});

export type GetBusinessesByIdsInput = z.infer<typeof getBusinessesByIdsSchema>;

type GetBusinessesByIdsResult =
  | { success: true; businesses: BusinessProps[] }
  | { success: false; error: string };

/**
 * Gets multiple businesses by their IDs
 *
 * @param input - Input with array of business IDs
 * @returns Result object with businesses list or error message
 */
export async function getBusinessesByIds(
  input: unknown
): Promise<GetBusinessesByIdsResult> {
  return validatePrivateAction(
    getBusinessesByIdsSchema,
    input,
    async (validated) => {
      const businessRepository = new PrismaBusinessRepository();
      const getBusinessesByIdsUseCase = new GetBusinessesByIdsUseCase(
        businessRepository
      );
      const result = await getBusinessesByIdsUseCase.execute(validated);

      if (result.success && result.businesses) {
        return {
          success: true,
          businesses: result.businesses.map((b) => b.toObject()),
        };
      }

      return {
        success: false,
        error: result.error || "Failed to get businesses",
      };
    },
    { errorMessage: "An unexpected error occurred while fetching businesses" }
  );
}
