/**
 * Create User Use Case
 *
 * This use case handles the creation of a new user in the system.
 * It checks for existing users, creates the domain entity,
 * and persists it using the repository.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/user
 */

import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { logger } from "@/lib/logger";

export interface CreateUserInput {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureFullPath?: string | null;
  phone?: string | null;
  countryCode?: string | null;
  birthday?: Date | null;
  timeZone?: string | null;
}

export interface CreateUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Create User Use Case
 *
 * Business logic for creating a new user:
 * 1. Check if user already exists (by ID or email)
 * 2. Create domain entity
 * 3. Persist using repository
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserResult> {
    try {
      logger.info(
        "CreateUserUseCase",
        input.id,
        `Creating user with email: ${input.email}`
      );

      // 1. Check if user already exists by ID
      const existingUserById = await this.userRepository.findById(input.id);

      if (existingUserById) {
        logger.info(
          "CreateUserUseCase",
          input.id,
          "User already exists, returning existing user"
        );
        return {
          success: true,
          user: existingUserById,
        };
      }

      // 2. Check if email is already taken
      const existingUserByEmail = await this.userRepository.findByEmail(
        input.email
      );

      if (existingUserByEmail) {
        logger.error(
          "CreateUserUseCase",
          input.id,
          `Email ${input.email} is already taken by another user`
        );
        return {
          success: false,
          error: "Email is already taken by another user",
        };
      }

      // 3. Create domain entity
      logger.info("CreateUserUseCase", input.id, "Creating User domain entity");

      const user = new User({
        id: input.id,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        pictureFullPath: input.pictureFullPath || null,
        phone: input.phone || null,
        countryCode: input.countryCode || null,
        birthday: input.birthday || null,
        timeZone: input.timeZone || null,
      });

      // 4. Persist using repository
      logger.info("CreateUserUseCase", input.id, "Persisting user to database");

      const createdUser = await this.userRepository.create(user);

      logger.info(
        "CreateUserUseCase",
        createdUser.id,
        "User created successfully"
      );

      return {
        success: true,
        user: createdUser,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "CreateUserUseCase",
          "system",
          `Error creating user: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "CreateUserUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while creating the user",
      };
    }
  }
}
