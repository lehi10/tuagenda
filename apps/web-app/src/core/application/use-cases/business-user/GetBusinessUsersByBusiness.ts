/**
 * Get BusinessUsers By Business Use Case
 *
 * This use case handles retrieving all users associated with a business.
 * It fetches the relationships using the repository.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import {
  BusinessUser,
  BusinessRole,
} from "@/core/domain/entities/BusinessUser";
import { logger } from "@/lib/logger";

export interface GetBusinessUsersByBusinessInput {
  businessId: string;
  role?: BusinessRole;
  limit?: number;
  offset?: number;
}

export interface GetBusinessUsersByBusinessResult {
  success: boolean;
  businessUsers?: BusinessUser[];
  error?: string;
}

/**
 * Get BusinessUsers By Business Use Case
 *
 * Business logic for retrieving business users:
 * 1. Fetch relationships using repository
 * 2. Return results
 */
export class GetBusinessUsersByBusinessUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(
    input: GetBusinessUsersByBusinessInput
  ): Promise<GetBusinessUsersByBusinessResult> {
    try {
      logger.info(
        "GetBusinessUsersByBusinessUseCase",
        "system",
        `Fetching users for business ${input.businessId}`
      );

      const businessUsers = await this.businessUserRepository.findByBusiness(
        input.businessId,
        {
          role: input.role,
          limit: input.limit,
          offset: input.offset,
        }
      );

      logger.info(
        "GetBusinessUsersByBusinessUseCase",
        "system",
        `Found ${businessUsers.length} users for business ${input.businessId}`
      );

      return {
        success: true,
        businessUsers,
      };
    } catch (error) {
      logger.error(
        "GetBusinessUsersByBusinessUseCase",
        "system",
        `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
}
