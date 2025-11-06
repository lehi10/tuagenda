/**
 * Get Business Server Action
 *
 * Fetches a single business by ID from the database.
 * This is used when viewing/editing business details.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/business
 */

"use server";

import { BusinessProps } from "@/core/domain/entities/Business";
import { GetBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

/**
 * Result type for the get business action
 */
type GetBusinessResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Fetches a single business by ID from the database
 *
 * @param id - The ID of the business to fetch
 * @returns Result object with business data or error message
 *
 * @example
 * ```typescript
 * const result = await getBusiness(1);
 *
 * if (result.success) {
 *   console.log('Business:', result.business);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getBusiness(id: number): Promise<GetBusinessResult> {
  try {
    // Dependency injection: Create repository and use case
    const businessRepository = new PrismaBusinessRepository();
    const getBusinessUseCase = new GetBusinessUseCase(businessRepository);

    // Execute use case
    const result = await getBusinessUseCase.execute({ id });

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
    console.error("Error in getBusiness action:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching the business",
    };
  }
}
