/**
 * Get ServiceCategory Use Case
 *
 * This use case handles retrieving a service category by ID.
 *
 * @module core/application/use-cases/service-category
 */

import { IServiceCategoryRepository } from "@/server/core/domain/repositories/IServiceCategoryRepository";
import { ServiceCategory } from "@/server/core/domain/entities/ServiceCategory";
import { logger } from "@/server/lib/logger";

export interface GetServiceCategoryInput {
  id: string;
}

export interface GetServiceCategoryResult {
  success: boolean;
  category?: ServiceCategory;
  error?: string;
}

/**
 * Get ServiceCategory Use Case
 *
 * Business logic for retrieving a service category by ID
 */
export class GetServiceCategoryUseCase {
  constructor(
    private readonly serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(
    input: GetServiceCategoryInput
  ): Promise<GetServiceCategoryResult> {
    try {
      logger.info(
        "GetServiceCategoryUseCase",
        "system",
        `Fetching service category with ID: ${input.id}`
      );

      const category = await this.serviceCategoryRepository.findById(input.id);

      if (!category) {
        logger.warning(
          "GetServiceCategoryUseCase",
          "system",
          `Service category not found with ID: ${input.id}`
        );
        return {
          success: false,
          error: "Service category not found",
        };
      }

      logger.info(
        "GetServiceCategoryUseCase",
        "system",
        `Service category found: ${category.name}`
      );

      return {
        success: true,
        category,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "GetServiceCategoryUseCase",
          "system",
          `Error fetching service category: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "GetServiceCategoryUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error:
          "An unexpected error occurred while fetching the service category",
      };
    }
  }
}
