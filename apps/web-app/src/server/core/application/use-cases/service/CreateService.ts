/**
 * Create Service Use Case
 *
 * This use case handles the creation of a new service in the system.
 * It validates the input, creates the domain entity, and persists it.
 *
 * @module core/application/use-cases/service
 */

import { IServiceRepository } from "@/server/core/domain/repositories/IServiceRepository";
import { Service } from "@/server/core/domain/entities/Service";
import { logger } from "@/server/lib/logger";

export interface CreateServiceInput {
  businessId: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  price: number;
  durationMinutes: number;
  active?: boolean;
  isVirtual?: boolean;
  requiresOnlinePayment?: boolean;
}

export interface CreateServiceResult {
  success: boolean;
  service?: Service;
  error?: string;
}

/**
 * Create Service Use Case
 *
 * Business logic for creating a new service:
 * 1. Check if service name already exists in the business
 * 2. Create domain entity
 * 3. Persist using repository
 */
export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: CreateServiceInput): Promise<CreateServiceResult> {
    try {
      logger.info(
        "CreateServiceUseCase",
        "system",
        `Creating service: ${input.name} for business: ${input.businessId}`
      );

      // 1. Check if service name already exists in the business
      const nameExists = await this.serviceRepository.nameExists(
        input.businessId,
        input.name
      );

      if (nameExists) {
        logger.error(
          "CreateServiceUseCase",
          "system",
          `Service name ${input.name} already exists in business ${input.businessId}`
        );
        return {
          success: false,
          error: "A service with this name already exists in this business",
        };
      }

      // 2. Create domain entity
      logger.info(
        "CreateServiceUseCase",
        "system",
        "Creating Service domain entity"
      );

      const service = new Service({
        businessId: input.businessId,
        categoryId: input.categoryId,
        name: input.name,
        description: input.description,
        price: input.price,
        durationMinutes: input.durationMinutes,
        active: input.active,
        isVirtual: input.isVirtual,
        requiresOnlinePayment: input.requiresOnlinePayment,
      });

      // 3. Persist using repository
      logger.info(
        "CreateServiceUseCase",
        "system",
        "Persisting service to database"
      );

      const createdService = await this.serviceRepository.create(service);

      logger.info(
        "CreateServiceUseCase",
        "system",
        `Service created successfully with ID: ${createdService.id}`
      );

      return {
        success: true,
        service: createdService,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "CreateServiceUseCase",
          "system",
          `Error creating service: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "CreateServiceUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while creating the service",
      };
    }
  }
}
