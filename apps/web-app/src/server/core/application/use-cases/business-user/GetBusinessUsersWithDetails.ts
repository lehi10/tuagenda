/**
 * Get Business Users With Details Use Case
 *
 * Retrieves business users with full user information for displaying employee lists.
 * This includes user details like name, email, phone, etc.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 */

import {
  IBusinessUserRepository,
  BusinessUserWithDetails,
} from "@/server/core/domain/repositories/IBusinessUserRepository";
import { logger } from "@/server/lib/logger";

export interface GetBusinessUsersWithDetailsInput {
  businessId: string;
  search?: string;
}

export interface GetBusinessUsersWithDetailsResult {
  success: boolean;
  businessUsers?: BusinessUserWithDetails[];
  error?: string;
}

export class GetBusinessUsersWithDetailsUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(
    input: GetBusinessUsersWithDetailsInput
  ): Promise<GetBusinessUsersWithDetailsResult> {
    try {
      logger.info(
        "GetBusinessUsersWithDetailsUseCase",
        "system",
        `Fetching business users with details for business ${input.businessId}`
      );

      const businessUsers =
        await this.businessUserRepository.findByBusinessWithUserDetails(
          input.businessId,
          input.search
        );

      logger.info(
        "GetBusinessUsersWithDetailsUseCase",
        "system",
        `Found ${businessUsers.length} business users with details`
      );

      return {
        success: true,
        businessUsers,
      };
    } catch (error) {
      logger.error(
        "GetBusinessUsersWithDetailsUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error: "Failed to fetch business users with details",
      };
    }
  }
}
