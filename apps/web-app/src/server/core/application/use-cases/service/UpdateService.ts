/**
 * Update Service Use Case
 *
 * This use case handles updating an existing service.
 *
 * @module core/application/use-cases/service
 */

import { IServiceRepository } from "@/server/core/domain/repositories/IServiceRepository";
import { Service } from "@/server/core/domain/entities/Service";
import { logger } from "@/server/lib/logger";

export interface UpdateServiceInput {
  id: string;
  categoryId?: string | null;
  name?: string;
  description?: string | null;
  price?: number;
  durationMinutes?: number;
  active?: boolean;
  isVirtual?: boolean;
  requiresOnlinePayment?: boolean;
}

export interface UpdateServiceResult {
  success: boolean;
  service?: Service;
  error?: string;
}

/**
 * Update Service Use Case
 *
 * Business logic for updating a service:
 * 1. Fetch existing service
 * 2. Check if new name is unique (if changed)
 * 3. Update domain entity
 * 4. Persist changes
 */
export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: UpdateServiceInput): Promise<UpdateServiceResult> {
    try {
      logger.info(
        "UpdateServiceUseCase",
        "system",
        `Updating service with ID: ${input.id}`
      );

      // 1. Fetch existing service
      const existingService = await this.serviceRepository.findById(input.id);

      if (!existingService) {
        logger.error(
          "UpdateServiceUseCase",
          "system",
          `Service not found with ID: ${input.id}`
        );
        return {
          success: false,
          error: "Service not found",
        };
      }

      // 2. Check if new name is unique (if changed)
      if (input.name && input.name !== existingService.name) {
        const nameExists = await this.serviceRepository.nameExists(
          existingService.businessId,
          input.name,
          input.id
        );

        if (nameExists) {
          logger.error(
            "UpdateServiceUseCase",
            "system",
            `Service name ${input.name} already exists in business ${existingService.businessId}`
          );
          return {
            success: false,
            error: "A service with this name already exists in this business",
          };
        }
      }

      // 3. Update domain entity
      logger.info(
        "UpdateServiceUseCase",
        "system",
        "Updating Service domain entity"
      );

      existingService.updateInfo({
        categoryId: input.categoryId,
        name: input.name,
        description: input.description,
        price: input.price,
        durationMinutes: input.durationMinutes,
        active: input.active,
        isVirtual: input.isVirtual,
        requiresOnlinePayment: input.requiresOnlinePayment,
      });

      // 4. Persist changes
      logger.info(
        "UpdateServiceUseCase",
        "system",
        "Persisting updated service to database"
      );

      const updatedService =
        await this.serviceRepository.update(existingService);

      logger.info(
        "UpdateServiceUseCase",
        "system",
        `Service updated successfully: ${updatedService.id}`
      );

      return {
        success: true,
        service: updatedService,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "UpdateServiceUseCase",
          "system",
          `Error updating service: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "UpdateServiceUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while updating the service",
      };
    }
  }
}
