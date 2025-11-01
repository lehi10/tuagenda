/**
 * Get User Use Case
 *
 * This use case handles retrieving a user from the system.
 * It validates the input and fetches the user using the repository.
 *
 * @module core/application/use-cases/user
 */

import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for getting a user
 */
const getUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type GetUserInput = z.infer<typeof getUserSchema>;

export interface GetUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Get User Use Case
 *
 * Business logic for retrieving a user:
 * 1. Validate input
 * 2. Fetch user from repository
 * 3. Return result
 */
export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: unknown): Promise<GetUserResult> {
    try {
      // 1. Validate input
      logger.info("GetUserUseCase", "system", "Validating input data");
      const validatedData = getUserSchema.parse(input);

      logger.info(
        "GetUserUseCase",
        validatedData.id,
        `Fetching user with ID: ${validatedData.id}`
      );

      // 2. Fetch user from repository
      const user = await this.userRepository.findById(validatedData.id);

      if (!user) {
        logger.info(
          "GetUserUseCase",
          validatedData.id,
          "User not found in database"
        );
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
      if (error instanceof z.ZodError) {
        logger.error(
          "GetUserUseCase",
          "system",
          `Validation error: ${JSON.stringify(error.issues)}`
        );
        return {
          success: false,
          error: "Invalid input data: " + error.issues[0].message,
        };
      }

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
