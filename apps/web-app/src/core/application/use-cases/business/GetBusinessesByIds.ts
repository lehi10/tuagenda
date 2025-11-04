/**
 * Get Businesses By IDs Use Case
 *
 * This use case handles retrieving multiple businesses by their IDs.
 * It validates input and fetches the businesses using the repository.
 *
 * @module core/application/use-cases/business
 */

import { IBusinessRepository } from "@/core/domain/repositories/IBusinessRepository";
import { Business } from "@/core/domain/entities/Business";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for getting businesses by IDs
 */
const getBusinessesByIdsSchema = z.object({
  ids: z.array(
    z.number().int().positive("Business ID must be a positive integer")
  ),
});

export type GetBusinessesByIdsInput = z.infer<typeof getBusinessesByIdsSchema>;

export interface GetBusinessesByIdsResult {
  success: boolean;
  businesses?: Business[];
  error?: string;
}

/**
 * Get Businesses By IDs Use Case
 *
 * Business logic for retrieving businesses by IDs:
 * 1. Validate input data
 * 2. Fetch businesses using repository
 * 3. Return results
 */
export class GetBusinessesByIdsUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: unknown): Promise<GetBusinessesByIdsResult> {
    try {
      // 1. Validate input
      logger.info(
        "GetBusinessesByIdsUseCase",
        "system",
        "Validating input data"
      );
      const validatedData = getBusinessesByIdsSchema.parse(input);

      if (validatedData.ids.length === 0) {
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
        `Fetching ${validatedData.ids.length} businesses`
      );

      // 2. Fetch businesses using repository
      const businesses = await this.businessRepository.findByIds(
        validatedData.ids
      );

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
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map((e) => e.message).join(", ");
        logger.error(
          "GetBusinessesByIdsUseCase",
          "system",
          `Validation error: ${errorMessage}`
        );
        return {
          success: false,
          error: `Validation error: ${errorMessage}`,
        };
      }

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
