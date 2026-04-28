import { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import {
  Business,
  BusinessStatus,
} from "@/server/core/domain/entities/Business";
import { logger } from "@/server/lib/logger";

export interface ListBusinessesInput {
  status?: BusinessStatus;
  city?: string;
  country?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListBusinessesResult {
  success: boolean;
  businesses?: Business[];
  total?: number;
  error?: string;
}

export class ListBusinessesUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(
    input: ListBusinessesInput = {}
  ): Promise<ListBusinessesResult> {
    try {
      logger.info(
        "ListBusinessesUseCase",
        "system",
        "Fetching businesses list"
      );

      const { businesses, total } = await this.businessRepository.findAllWithCount(input);

      logger.info(
        "ListBusinessesUseCase",
        "system",
        `Found ${businesses.length} businesses (total: ${total})`
      );
      return { success: true, businesses, total };
    } catch (error) {
      logger.error(
        "ListBusinessesUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to fetch businesses" };
    }
  }
}
