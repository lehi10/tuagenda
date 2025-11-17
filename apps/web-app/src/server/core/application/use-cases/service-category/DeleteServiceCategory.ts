/**
 * Delete ServiceCategory Use Case
 *
 * This use case handles deleting a service category.
 *
 * @module core/application/use-cases/service-category
 */

import { IServiceCategoryRepository } from "@/server/core/domain/repositories/IServiceCategoryRepository";
import { logger } from "@/server/lib/logger";

export interface DeleteServiceCategoryInput {
  id: string;
}

export interface DeleteServiceCategoryResult {
  success: boolean;
  error?: string;
}

/**
 * Delete ServiceCategory Use Case
 *
 * Business logic for deleting a service category:
 * 1. Check if category exists
 * 2. Delete the category
 */
export class DeleteServiceCategoryUseCase {
  constructor(
    private readonly serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(
    input: DeleteServiceCategoryInput
  ): Promise<DeleteServiceCategoryResult> {
    try {
      logger.info(
        "DeleteServiceCategoryUseCase",
        "system",
        `Deleting service category with ID: ${input.id}`
      );

      // 1. Check if category exists
      const exists = await this.serviceCategoryRepository.exists(input.id);

      if (!exists) {
        logger.error(
          "DeleteServiceCategoryUseCase",
          "system",
          `Service category not found with ID: ${input.id}`
        );
        return {
          success: false,
          error: "Service category not found",
        };
      }

      // 2. Delete the category
      logger.info(
        "DeleteServiceCategoryUseCase",
        "system",
        "Deleting service category from database"
      );

      await this.serviceCategoryRepository.delete(input.id);

      logger.info(
        "DeleteServiceCategoryUseCase",
        "system",
        `Service category deleted successfully: ${input.id}`
      );

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "DeleteServiceCategoryUseCase",
          "system",
          `Error deleting service category: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "DeleteServiceCategoryUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error:
          "An unexpected error occurred while deleting the service category",
      };
    }
  }
}
