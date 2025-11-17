import { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import { Business } from "@/server/core/domain/entities/Business";
import { logger } from "@/server/lib/logger";

export interface GetBusinessInput {
  id: string;
}

export interface GetBusinessResult {
  success: boolean;
  business?: Business;
  error?: string;
}

export class GetBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: GetBusinessInput): Promise<GetBusinessResult> {
    try {
      logger.info(
        "GetBusinessUseCase",
        "system",
        `Fetching business with ID: ${input.id}`
      );

      const business = await this.businessRepository.findById(input.id);

      if (!business) {
        logger.info("GetBusinessUseCase", "system", "Business not found");
        return { success: false, error: "Business not found" };
      }

      logger.info(
        "GetBusinessUseCase",
        "system",
        "Business retrieved successfully"
      );
      return { success: true, business };
    } catch (error) {
      logger.error(
        "GetBusinessUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to fetch business" };
    }
  }
}
