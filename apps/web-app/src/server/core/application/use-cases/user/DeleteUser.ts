/**
 * Delete User Use Case
 *
 * Deletes a user from the system.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 */

import { IUserRepository } from "@/server/core/domain/repositories/IUserRepository";
import { logger } from "@/server/lib/logger";

export interface DeleteUserInput {
  id: string;
}

export interface DeleteUserResult {
  success: boolean;
  error?: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserResult> {
    try {
      logger.info("DeleteUserUseCase", input.id, "Attempting to delete user");

      // Check if user exists
      const user = await this.userRepository.findById(input.id);

      if (!user) {
        logger.warning("DeleteUserUseCase", input.id, "User not found");
        return {
          success: false,
          error: "User not found",
        };
      }

      // Delete user
      await this.userRepository.delete(input.id);

      logger.info(
        "DeleteUserUseCase",
        input.id,
        `User deleted successfully: ${user.email}`
      );

      return {
        success: true,
      };
    } catch (error) {
      logger.error(
        "DeleteUserUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error: "Failed to delete user",
      };
    }
  }
}
