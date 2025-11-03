/**
 * Get Businesses By IDs Server Action
 *
 * This server action handles retrieving multiple businesses by their IDs.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business
 */

"use server";

import { BusinessProps } from "@/core/domain/entities";
import {
  GetBusinessesByIdsUseCase,
  GetBusinessesByIdsInput,
} from "@/core/application/use-cases/business/GetBusinessesByIds";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

/**
 * Result type for the get businesses by IDs action
 */
type GetBusinessesByIdsResult =
  | { success: true; businesses: BusinessProps[] }
  | { success: false; error: string };

/**
 * Gets multiple businesses by their IDs
 *
 * This function should be called to retrieve multiple businesses at once.
 *
 * @param data - Query parameters with array of IDs
 * @returns Result object with success status and businesses list or error message
 *
 * @example
 * ```typescript
 * const result = await getBusinessesByIds({ ids: [1, 2, 3] });
 *
 * if (result.success) {
 *   console.log('Businesses:', result.businesses);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getBusinessesByIds(
  data: GetBusinessesByIdsInput
): Promise<GetBusinessesByIdsResult> {
  // Dependency injection: Create repository and use case
  const businessRepository = new PrismaBusinessRepository();
  const getBusinessesByIdsUseCase = new GetBusinessesByIdsUseCase(
    businessRepository
  );

  // Execute use case
  const result = await getBusinessesByIdsUseCase.execute(data);

  // Return domain result directly
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
}
