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
 * @module actions/business
 */

"use server";

import { BusinessProps } from "@/core/domain/entities/Business";
import { GetBusinessBySlugUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

/**
 * Result type for the get business by slug action
 */
type GetBusinessBySlugResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Fetches a single business by slug from the database
 *
 * PUBLIC ACTION - No token or authentication required
 *
 * @param slug - The slug of the business to fetch (e.g., "my-salon")
 * @returns Result object with business data or error message
 *
 * @example
 * ```typescript
 * // In a public booking page
 * const result = await getBusinessBySlug("my-salon");
 *
 * if (result.success) {
 *   console.log('Business:', result.business);
 *   // Display booking form with business info
 * } else {
 *   console.error('Business not found');
 *   // Show 404 page
 * }
 * ```
 */
export async function getBusinessBySlug(
  slug: string
): Promise<GetBusinessBySlugResult> {
  try {
    // Dependency injection: Create repository and use case
    const businessRepository = new PrismaBusinessRepository();
    const getBusinessBySlugUseCase = new GetBusinessBySlugUseCase(
      businessRepository
    );

    // Execute use case
    const result = await getBusinessBySlugUseCase.execute({ slug });

    // Convert domain entity to plain object for serialization
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
  } catch (error) {
    console.error("Error in getBusinessBySlug action:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching the business",
    };
  }
}
