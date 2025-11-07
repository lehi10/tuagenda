/**
 * Get BusinessUsers By User Use Case
 *
 * This use case handles retrieving all businesses associated with a user.
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

export interface GetBusinessUsersByUserInput {
  userId: string;
  role?: BusinessRole;
  limit?: number;
  offset?: number;
}

export interface GetBusinessUsersByUserResult {
  success: boolean;
  businessUsers?: BusinessUser[];
  error?: string;
}

/**
 * Get BusinessUsers By User Use Case
 *
 * Business logic for retrieving user's businesses:
 * 1. Fetch relationships using repository
 * 2. Return results
 */
export class GetBusinessUsersByUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(
    input: GetBusinessUsersByUserInput
  ): Promise<GetBusinessUsersByUserResult> {
    try {
      logger.info(
        "GetBusinessUsersByUserUseCase",
        input.userId,
        "Fetching businesses for user"
      );

      const businessUsers = await this.businessUserRepository.findByUser(
        input.userId,
        {
          role: input.role,
          limit: input.limit,
          offset: input.offset,
        }
      );

      logger.info(
        "GetBusinessUsersByUserUseCase",
        input.userId,
        `Found ${businessUsers.length} businesses for user`
      );

      return {
        success: true,
        businessUsers,
      };
    } catch (error) {
      logger.error(
        "GetBusinessUsersByUserUseCase",
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
