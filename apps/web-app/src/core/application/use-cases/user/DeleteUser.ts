/**
 * Delete User Use Case
 *
 * Deletes a user from the system.
 */

import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { z } from "zod";
import { logger } from "@/lib/logger";

const deleteUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export interface DeleteUserResult {
  success: boolean;
  error?: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: unknown): Promise<DeleteUserResult> {
    try {
      const validatedData = deleteUserSchema.parse(input);

      logger.info(
        "DeleteUserUseCase",
        validatedData.id,
        "Attempting to delete user"
      );

      // Check if user exists
      const user = await this.userRepository.findById(validatedData.id);

      if (!user) {
        logger.warning("DeleteUserUseCase", validatedData.id, "User not found");
        return {
          success: false,
          error: "User not found",
        };
      }

      // Delete user
      await this.userRepository.delete(validatedData.id);

      logger.info(
        "DeleteUserUseCase",
        validatedData.id,
        `User deleted successfully: ${user.email}`
      );

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }

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
