/**
 * Get BusinessUsers With User Details Server Action
 *
 * This server action retrieves business users with full user information.
 * It combines BusinessUser data with User data for displaying employee lists.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business-user
 */

"use server";

import { z } from "zod";
import { GetBusinessUsersWithDetailsUseCase } from "@/server/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/server/infrastructure/repositories";
import { validatePrivateAction } from "@/server/lib/utils/action-validator";
import { BusinessUserWithDetails as IBusinessUserWithDetails } from "@/server/core/domain/repositories/IBusinessUserRepository";

// Re-export the type for consumers
export type BusinessUserWithDetails = IBusinessUserWithDetails;

// Schema validation
const getBusinessUsersWithDetailsSchema = z.object({
  businessId: z.string().uuid("Business ID must be a valid UUID"),
  search: z.string().optional(),
});

export type GetBusinessUsersWithDetailsInput = z.infer<
  typeof getBusinessUsersWithDetailsSchema
>;

type GetBusinessUsersWithDetailsResult =
  | { success: true; businessUsers: BusinessUserWithDetails[] }
  | { success: false; error: string };

/**
 * Gets all business users with their user details for a specific business
 *
 * @param input - Input with businessId and optional search term
 * @returns Result object with business users including user details
 */
export async function getBusinessUsersWithDetails(
  input: unknown
): Promise<GetBusinessUsersWithDetailsResult> {
  return validatePrivateAction(
    getBusinessUsersWithDetailsSchema,
    input,
    async (validated) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersWithDetailsUseCase =
        new GetBusinessUsersWithDetailsUseCase(businessUserRepository);

      const result =
        await getBusinessUsersWithDetailsUseCase.execute(validated);

      if (result.success && result.businessUsers) {
        return {
          success: true,
          businessUsers: result.businessUsers,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to fetch business users with details",
      };
    },
    {
      errorMessage:
        "An unexpected error occurred while fetching business users with details",
    }
  );
}
