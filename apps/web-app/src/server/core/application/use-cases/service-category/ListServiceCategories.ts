/**
 * List ServiceCategories Use Case
 *
 * This use case handles retrieving all service categories for a business.
 *
 * @module core/application/use-cases/service-category
 */

import { IServiceCategoryRepository } from "@/server/core/domain/repositories/IServiceCategoryRepository";
import { ServiceCategory } from "@/server/core/domain/entities/ServiceCategory";
import { logger } from "@/server/lib/logger";

export interface ListServiceCategoriesInput {
  businessId: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListServiceCategoriesResult {
  success: boolean;
  categories?: ServiceCategory[];
  total?: number;
  error?: string;
}

/**
 * List ServiceCategories Use Case
 *
 * Business logic for listing service categories for a business
 */
export class ListServiceCategoriesUseCase {
  constructor(
    private readonly serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(
    input: ListServiceCategoriesInput
  ): Promise<ListServiceCategoriesResult> {
    try {
      logger.info(
        "ListServiceCategoriesUseCase",
        "system",
        `Listing service categories for business: ${input.businessId}`
      );

      const [categories, total] = await Promise.all([
        this.serviceCategoryRepository.findByBusinessId(input.businessId, {
          search: input.search,
          limit: input.limit,
          offset: input.offset,
        }),
        this.serviceCategoryRepository.count(input.businessId),
      ]);

      logger.info(
        "ListServiceCategoriesUseCase",
        "system",
        `Found ${categories.length} service categories (total: ${total})`
      );

      return {
        success: true,
        categories,
        total,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "ListServiceCategoriesUseCase",
          "system",
          `Error listing service categories: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "ListServiceCategoriesUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while listing service categories",
      };
    }
  }
}
