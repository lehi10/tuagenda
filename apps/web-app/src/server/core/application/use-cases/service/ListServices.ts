/**
 * List Services Use Case
 *
 * This use case handles retrieving all services for a business with filtering.
 *
 * @module core/application/use-cases/service
 */

import { IServiceRepository } from "@/server/core/domain/repositories/IServiceRepository";
import { Service } from "@/server/core/domain/entities/Service";
import { logger } from "@/server/lib/logger";

export interface ListServicesInput {
  businessId: string;
  categoryId?: string | null;
  active?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
}

export interface ListServicesResult {
  success: boolean;
  services?: Service[];
  total?: number;
  error?: string;
}

/**
 * List Services Use Case
 *
 * Business logic for listing services for a business
 */
export class ListServicesUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: ListServicesInput): Promise<ListServicesResult> {
    try {
      logger.info(
        "ListServicesUseCase",
        "system",
        `Listing services for business: ${input.businessId}`
      );

      const filters = {
        categoryId: input.categoryId,
        active: input.active,
        search: input.search,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        minDuration: input.minDuration,
        maxDuration: input.maxDuration,
        limit: input.limit,
        offset: input.offset,
      };

      const [services, total] = await Promise.all([
        this.serviceRepository.findByBusinessId(input.businessId, filters),
        this.serviceRepository.count(input.businessId, filters),
      ]);

      logger.info(
        "ListServicesUseCase",
        "system",
        `Found ${services.length} services (total: ${total})`
      );

      return {
        success: true,
        services,
        total,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "ListServicesUseCase",
          "system",
          `Error listing services: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "ListServicesUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while listing services",
      };
    }
  }
}
