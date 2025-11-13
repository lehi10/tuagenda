/**
 * Get Business Server Action
 *
 * Fetches a single business by ID from the database.
 * This is used when viewing/editing business details.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business
 */

"use server";

import { z } from "zod";
import { BusinessProps } from "@/core/domain/entities/Business";
import { GetBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";
import { validatePublicAction } from "@/lib/utils/action-validator";

// Schema validation
const getBusinessSchema = z.object({
  id: z.string().uuid("Business ID must be a valid UUID"),
});

export type GetBusinessInput = z.infer<typeof getBusinessSchema>;

type GetBusinessResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Fetches a single business by ID from the database
 *
 * @param input - Input with business ID to fetch
 * @returns Result object with business data or error message
 */
export async function getBusiness(input: unknown): Promise<GetBusinessResult> {
  return validatePublicAction(
    getBusinessSchema,
    input,
    async (validated) => {
      const businessRepository = new PrismaBusinessRepository();
      const getBusinessUseCase = new GetBusinessUseCase(businessRepository);
      const result = await getBusinessUseCase.execute({ id: validated.id });

      if (result.success && result.business) {
        return {
          success: true,
          business: result.business.toObject(),
        };
      }

      return {
        success: false,
        error: result.error || "Business not found",
      };
    },
    { errorMessage: "An unexpected error occurred while fetching the business" }
  );
}
