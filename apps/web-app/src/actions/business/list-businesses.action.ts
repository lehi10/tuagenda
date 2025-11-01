/**
 * List Businesses Server Action
 *
 * Fetches all businesses with optional filtering.
 * This is used to display businesses in the dashboard.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/business
 */

"use server";

import { BusinessProps } from "@/core/domain/entities/Business";
import { ListBusinessesUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

/**
 * Filters for listing businesses
 */
export interface ListBusinessesFilters {
  search?: string;
  city?: string;
  country?: string;
  limit?: number;
  offset?: number;
}

/**
 * Result type for the list businesses action
 */
type ListBusinessesResult =
  | { success: true; businesses: BusinessProps[]; total: number }
  | { success: false; error: string };

/**
 * Fetches all businesses from database with optional filtering
 *
 * @param filters - Optional filters for searching/filtering businesses
 * @returns Result object with businesses array and total count or error message
 *
 * @example
 * ```typescript
 * const result = await listBusinesses({ city: 'Santiago' });
 *
 * if (result.success) {
 *   console.log('Businesses:', result.businesses);
 *   console.log('Total:', result.total);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function listBusinesses(
  filters?: ListBusinessesFilters
): Promise<ListBusinessesResult> {
  try {
    // Dependency injection: Create repository and use case
    const businessRepository = new PrismaBusinessRepository();
    const listBusinessesUseCase = new ListBusinessesUseCase(businessRepository);

    // Execute use case
    const result = await listBusinessesUseCase.execute(filters);

    // Convert domain entities to plain objects for serialization
    if (result.success && result.businesses) {
      return {
        success: true,
        businesses: result.businesses.map((b) => b.toObject()),
        total: result.total || 0,
      };
    }

    return {
      success: false,
      error: result.error || "Failed to fetch businesses",
    };
  } catch (error) {
    console.error("Error in listBusinesses action:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching businesses",
    };
  }
}
