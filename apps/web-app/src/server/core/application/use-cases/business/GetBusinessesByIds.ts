/**
 * Get Businesses By IDs Use Case
 *
 * This use case handles retrieving multiple businesses by their IDs.
 * It fetches the businesses using the repository.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/business
 */

import { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import { Business } from "@/server/core/domain/entities/Business";
import { logger } from "@/server/lib/logger";

export interface GetBusinessesByIdsInput {
  ids: string[];
}

export interface GetBusinessesByIdsResult {
  success: boolean;
  businesses?: Business[];
  error?: string;
}

/**
 * Get Businesses By IDs Use Case
 *
 * Business logic for retrieving businesses by IDs:
 * 1. Fetch businesses using repository
 * 2. Return results
 */
export class GetBusinessesByIdsUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(
    input: GetBusinessesByIdsInput
  ): Promise<GetBusinessesByIdsResult> {
    try {
      if (input.ids.length === 0) {
        logger.info(
          "GetBusinessesByIdsUseCase",
          "system",
          "No IDs provided, returning empty array"
        );
        return {
          success: true,
          businesses: [],
        };
      }

      logger.info(
        "GetBusinessesByIdsUseCase",
        "system",
        `Fetching ${input.ids.length} businesses`
      );

      const businesses = await this.businessRepository.findByIds(input.ids);

      logger.info(
        "GetBusinessesByIdsUseCase",
        "system",
        `Found ${businesses.length} businesses`
      );

      return {
        success: true,
        businesses,
      };
    } catch (error) {
      logger.error(
        "GetBusinessesByIdsUseCase",
        "system",
        `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
}
