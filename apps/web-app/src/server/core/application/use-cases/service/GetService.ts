/**
 * Get Service Use Case
 *
 * This use case handles retrieving a service by ID.
 *
 * @module core/application/use-cases/service
 */

import { IServiceRepository } from "@/server/core/domain/repositories/IServiceRepository";
import { Service } from "@/server/core/domain/entities/Service";
import { logger } from "@/server/lib/logger";

export interface GetServiceInput {
  id: string;
}

export interface GetServiceResult {
  success: boolean;
  service?: Service;
  error?: string;
}

/**
 * Get Service Use Case
 *
 * Business logic for retrieving a service by ID
 */
export class GetServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: GetServiceInput): Promise<GetServiceResult> {
    try {
      logger.info(
        "GetServiceUseCase",
        "system",
        `Fetching service with ID: ${input.id}`
      );

      const service = await this.serviceRepository.findById(input.id);

      if (!service) {
        logger.warning(
          "GetServiceUseCase",
          "system",
          `Service not found with ID: ${input.id}`
        );
        return {
          success: false,
          error: "Service not found",
        };
      }

      logger.info(
        "GetServiceUseCase",
        "system",
        `Service found: ${service.name}`
      );

      return {
        success: true,
        service,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "GetServiceUseCase",
          "system",
          `Error fetching service: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "GetServiceUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while fetching the service",
      };
    }
  }
}
