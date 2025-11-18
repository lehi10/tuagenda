/**
 * Create ServiceCategory Use Case
 *
 * This use case handles the creation of a new service category in the system.
 * It checks for existing name within business, creates the domain entity,
 * and persists it using the repository.
 *
 * @module core/application/use-cases/service-category
 */

import { IServiceCategoryRepository } from "@/server/core/domain/repositories/IServiceCategoryRepository";
import { ServiceCategory } from "@/server/core/domain/entities/ServiceCategory";
import { logger } from "@/server/lib/logger";

export interface CreateServiceCategoryInput {
  businessId: string;
  name: string;
  description?: string | null;
}

export interface CreateServiceCategoryResult {
  success: boolean;
  category?: ServiceCategory;
  error?: string;
}

/**
 * Create ServiceCategory Use Case
 *
 * Business logic for creating a new service category:
 * 1. Check if name already exists within the business
 * 2. Create domain entity
 * 3. Persist using repository
 */
export class CreateServiceCategoryUseCase {
  constructor(
    private readonly serviceCategoryRepository: IServiceCategoryRepository
  ) {}

  async execute(
    input: CreateServiceCategoryInput
  ): Promise<CreateServiceCategoryResult> {
    try {
      logger.info(
        "CreateServiceCategoryUseCase",
        "system",
        `Creating service category: ${input.name} for business: ${input.businessId}`
      );

      // 1. Check if name already exists within the business
      const nameExists = await this.serviceCategoryRepository.nameExists(
        input.businessId,
        input.name
      );

      if (nameExists) {
        logger.error(
          "CreateServiceCategoryUseCase",
          "system",
          `Category name ${input.name} already exists in business ${input.businessId}`
        );
        return {
          success: false,
          error: "A category with this name already exists in this business",
        };
      }

      // 2. Create domain entity
      logger.info(
        "CreateServiceCategoryUseCase",
        "system",
        "Creating ServiceCategory domain entity"
      );

      const category = new ServiceCategory({
        businessId: input.businessId,
        name: input.name,
        description: input.description,
      });

      // 3. Persist using repository
      logger.info(
        "CreateServiceCategoryUseCase",
        "system",
        "Persisting service category to database"
      );

      const createdCategory =
        await this.serviceCategoryRepository.create(category);

      logger.info(
        "CreateServiceCategoryUseCase",
        "system",
        `Service category created successfully with ID: ${createdCategory.id}`
      );

      return {
        success: true,
        category: createdCategory,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "CreateServiceCategoryUseCase",
          "system",
          `Error creating service category: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "CreateServiceCategoryUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error:
          "An unexpected error occurred while creating the service category",
      };
    }
  }
}
