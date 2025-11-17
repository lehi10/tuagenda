/**
 * Update ServiceCategory Use Case
 *
 * This use case handles updating an existing service category.
 *
 * @module core/application/use-cases/service-category
 */

import { IServiceCategoryRepository } from "@/server/core/domain/repositories/IServiceCategoryRepository";
import { ServiceCategory } from "@/server/core/domain/entities/ServiceCategory";
import { logger } from "@/server/lib/logger";

export interface UpdateServiceCategoryInput {
  id: string;
  name?: string;
  description?: string | null;
}

export interface UpdateServiceCategoryResult {
  success: boolean;
  category?: ServiceCategory;
  error?: string;
}

/**
 * Update ServiceCategory Use Case
 *
 * Business logic for updating a service category:
 * 1. Fetch existing category
 * 2. Check if new name is unique (if changed)
 * 3. Update domain entity
 * 4. Persist changes
 */
export class UpdateServiceCategoryUseCase {
  constructor(
    private readonly serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(
    input: UpdateServiceCategoryInput
  ): Promise<UpdateServiceCategoryResult> {
    try {
      logger.info(
        "UpdateServiceCategoryUseCase",
        "system",
        `Updating service category with ID: ${input.id}`
      );

      // 1. Fetch existing category
      const existingCategory = await this.serviceCategoryRepository.findById(
        input.id
      );

      if (!existingCategory) {
        logger.error(
          "UpdateServiceCategoryUseCase",
          "system",
          `Service category not found with ID: ${input.id}`
        );
        return {
          success: false,
          error: "Service category not found",
        };
      }

      // 2. Check if new name is unique (if changed)
      if (input.name && input.name !== existingCategory.name) {
        const nameExists = await this.serviceCategoryRepository.nameExists(
          existingCategory.businessId,
          input.name,
          input.id
        );

        if (nameExists) {
          logger.error(
            "UpdateServiceCategoryUseCase",
            "system",
            `Category name ${input.name} already exists in business ${existingCategory.businessId}`
          );
          return {
            success: false,
            error: "A category with this name already exists in this business",
          };
        }
      }

      // 3. Update domain entity
      logger.info(
        "UpdateServiceCategoryUseCase",
        "system",
        "Updating ServiceCategory domain entity"
      );

      existingCategory.updateInfo({
        name: input.name,
        description: input.description,
      });

      // 4. Persist changes
      logger.info(
        "UpdateServiceCategoryUseCase",
        "system",
        "Persisting updated service category to database"
      );

      const updatedCategory =
        await this.serviceCategoryRepository.update(existingCategory);

      logger.info(
        "UpdateServiceCategoryUseCase",
        "system",
        `Service category updated successfully: ${updatedCategory.id}`
      );

      return {
        success: true,
        category: updatedCategory,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "UpdateServiceCategoryUseCase",
          "system",
          `Error updating service category: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "UpdateServiceCategoryUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error:
          "An unexpected error occurred while updating the service category",
      };
    }
  }
}
