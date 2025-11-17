/**
 * Delete Service Use Case
 *
 * This use case handles deleting a service.
 *
 * @module core/application/use-cases/service
 */

import { IServiceRepository } from "@/server/core/domain/repositories/IServiceRepository";
import { logger } from "@/server/lib/logger";

export interface DeleteServiceInput {
  id: string;
}

export interface DeleteServiceResult {
  success: boolean;
  error?: string;
}

/**
 * Delete Service Use Case
 *
 * Business logic for deleting a service:
 * 1. Check if service exists
 * 2. Delete the service
 */
export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: DeleteServiceInput): Promise<DeleteServiceResult> {
    try {
      logger.info(
        "DeleteServiceUseCase",
        "system",
        `Deleting service with ID: ${input.id}`
      );

      // 1. Check if service exists
      const exists = await this.serviceRepository.exists(input.id);

      if (!exists) {
        logger.error(
          "DeleteServiceUseCase",
          "system",
          `Service not found with ID: ${input.id}`
        );
        return {
          success: false,
          error: "Service not found",
        };
      }

      // 2. Delete the service
      logger.info(
        "DeleteServiceUseCase",
        "system",
        "Deleting service from database"
      );

      await this.serviceRepository.delete(input.id);

      logger.info(
        "DeleteServiceUseCase",
        "system",
        `Service deleted successfully: ${input.id}`
      );

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "DeleteServiceUseCase",
          "system",
          `Error deleting service: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "DeleteServiceUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while deleting the service",
      };
    }
  }
}
