/**
 * Get Business By Slug Server Action
 *
 * PUBLIC ACTION - No authentication required
 *
 * This action is specifically designed for PUBLIC booking flows.
 * It allows anyone to fetch business information using a slug,
 * enabling public booking pages like /book/my-business-slug
 *
 * IMPORTANT: This action does NOT require authentication or authorization.
 * It's intended for public-facing pages where users need to see business
 * information to make a booking.
 *
 * Use cases:
 * - Public booking pages
 * - Business profile/landing pages
 * - Service catalog pages
 * - Any public business information display
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business
 */

"use server";

import { z } from "zod";
import { BusinessProps } from "@/server/core/domain/entities/Business";
import { GetBusinessBySlugUseCase } from "@/server/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/server/infrastructure/repositories";
import { validatePublicAction } from "@/server/lib/utils/action-validator";

// Schema validation
const getBusinessBySlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export type GetBusinessBySlugInput = z.infer<typeof getBusinessBySlugSchema>;

type GetBusinessBySlugResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Fetches a single business by slug from the database
 *
 * PUBLIC ACTION - No token or authentication required
 *
 * @param input - Input with business slug to fetch
 * @returns Result object with business data or error message
 */
export async function getBusinessBySlug(
  input: unknown
): Promise<GetBusinessBySlugResult> {
  return validatePublicAction(
    getBusinessBySlugSchema,
    input,
    async (validated) => {
      const businessRepository = new PrismaBusinessRepository();
      const getBusinessBySlugUseCase = new GetBusinessBySlugUseCase(
        businessRepository
      );
      const result = await getBusinessBySlugUseCase.execute({
        slug: validated.slug,
      });

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
