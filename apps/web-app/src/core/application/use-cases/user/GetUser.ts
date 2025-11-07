/**
 * Get User Use Case
 *
 * This use case handles retrieving a user from the system.
 * It fetches the user using the repository.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/user
 */

import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { logger } from "@/lib/logger";

export interface GetUserInput {
  id: string;
}

export interface GetUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Get User Use Case
 *
 * Business logic for retrieving a user:
 * 1. Fetch user from repository
 * 2. Return result
 */
export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserResult> {
    try {
      logger.info(
        "GetUserUseCase",
        input.id,
        `Fetching user with ID: ${input.id}`
      );

      const user = await this.userRepository.findById(input.id);

      if (!user) {
        logger.info("GetUserUseCase", input.id, "User not found in database");
        return {
          success: false,
          error: "User not found",
        };
      }

      logger.info("GetUserUseCase", user.id, "User retrieved successfully");

      return {
        success: true,
        user,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "GetUserUseCase",
          "system",
          `Error fetching user: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "GetUserUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while fetching the user",
      };
    }
  }
}
