/**
 * Update Business Server Action
 *
 * Updates an existing business in the database.
 * This is used when editing business information from the dashboard.
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
import { UpdateBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";
import { validateAndExecute } from "@/lib/utils/action-validator";

// Schema validation
const updateBusinessSchema = z.object({
  id: z.number().int().positive("Business ID must be a positive integer"),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  domain: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  timeZone: z.string().optional(),
  locale: z.string().optional(),
  currency: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;

type UpdateBusinessResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Updates an existing business in the database
 *
 * @param input - Business data to update (must include id)
 * @returns Result object with updated business or error message
 */
export async function updateBusiness(
  input: unknown
): Promise<UpdateBusinessResult> {
  return validateAndExecute(
    updateBusinessSchema,
    input,
    async (validated) => {
      const businessRepository = new PrismaBusinessRepository();
      const updateBusinessUseCase = new UpdateBusinessUseCase(
        businessRepository
      );
      const result = await updateBusinessUseCase.execute(validated);

      if (result.success && result.business) {
        return {
          success: true,
          business: result.business.toObject(),
        };
      }

      return {
        success: false,
        error: result.error || "Failed to update business",
      };
    },
    { errorMessage: "An unexpected error occurred while updating the business" }
  );
}
