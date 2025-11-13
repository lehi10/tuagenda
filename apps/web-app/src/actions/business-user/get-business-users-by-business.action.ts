/**
 * Get BusinessUsers By Business Server Action
 *
 * This server action handles retrieving all users associated with a business.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business-user
 */

"use server";

import { z } from "zod";
import { BusinessUserProps, BusinessRole } from "@/core/domain/entities";
import { GetBusinessUsersByBusinessUseCase } from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const getBusinessUsersByBusinessSchema = z.object({
  businessId: z.string().uuid("Business ID must be a valid UUID"),
  role: z.nativeEnum(BusinessRole).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type GetBusinessUsersByBusinessInput = z.infer<
  typeof getBusinessUsersByBusinessSchema
>;

type GetBusinessUsersByBusinessResult =
  | { success: true; businessUsers: BusinessUserProps[] }
  | { success: false; error: string };

/**
 * Gets all users associated with a business
 *
 * @param input - Query parameters (businessId, optional filters)
 * @returns Result object with success status and business-user list or error message
 */
export async function getBusinessUsersByBusiness(
  input: unknown
): Promise<GetBusinessUsersByBusinessResult> {
  return validatePrivateAction(
    getBusinessUsersByBusinessSchema,
    input,
    async (validated) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersByBusinessUseCase =
        new GetBusinessUsersByBusinessUseCase(businessUserRepository);

      const result = await getBusinessUsersByBusinessUseCase.execute(validated);

      if (result.success && result.businessUsers) {
        return {
          success: true,
          businessUsers: result.businessUsers.map((bu) => bu.toObject()),
        };
      }

      return {
        success: false,
        error: result.error || "Failed to get business users",
      };
    },
    {
      errorMessage:
        "An unexpected error occurred while fetching business users",
    }
  );
}
