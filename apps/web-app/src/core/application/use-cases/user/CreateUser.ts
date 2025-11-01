/**
 * Create User Use Case
 *
 * This use case handles the creation of a new user in the system.
 * It validates input, checks for existing users, creates the domain entity,
 * and persists it using the repository.
 *
 * @module core/application/use-cases/user
 */

import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for creating a user
 */
const createUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(1, "First name is required").max(255),
  lastName: z.string().min(1, "Last name is required").max(255),
  pictureFullPath: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  countryCode: z.string().optional().nullable(),
  birthday: z.date().optional().nullable(),
  timeZone: z.string().optional().nullable(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export interface CreateUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Create User Use Case
 *
 * Business logic for creating a new user:
 * 1. Validate input data
 * 2. Check if user already exists (by ID or email)
 * 3. Create domain entity
 * 4. Persist using repository
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: unknown): Promise<CreateUserResult> {
    try {
      // 1. Validate input
      logger.info("CreateUserUseCase", "system", "Validating input data");
      const validatedData = createUserSchema.parse(input);

      logger.info(
        "CreateUserUseCase",
        validatedData.id,
        `Creating user with email: ${validatedData.email}`
      );

      // 2. Check if user already exists by ID
      const existingUserById = await this.userRepository.findById(
        validatedData.id
      );

      if (existingUserById) {
        logger.info(
          "CreateUserUseCase",
          validatedData.id,
          "User already exists, returning existing user"
        );
        return {
          success: true,
          user: existingUserById,
        };
      }

      // 3. Check if email is already taken
      const existingUserByEmail = await this.userRepository.findByEmail(
        validatedData.email
      );

      if (existingUserByEmail) {
        logger.error(
          "CreateUserUseCase",
          validatedData.id,
          `Email ${validatedData.email} is already taken by another user`
        );
        return {
          success: false,
          error: "Email is already taken by another user",
        };
      }

      // 4. Create domain entity
      logger.info(
        "CreateUserUseCase",
        validatedData.id,
        "Creating User domain entity"
      );

      const user = new User({
        id: validatedData.id,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        pictureFullPath: validatedData.pictureFullPath || null,
        phone: validatedData.phone || null,
        countryCode: validatedData.countryCode || null,
        birthday: validatedData.birthday || null,
        timeZone: validatedData.timeZone || null,
      });

      // 5. Persist using repository
      logger.info(
        "CreateUserUseCase",
        validatedData.id,
        "Persisting user to database"
      );

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
      if (error instanceof z.ZodError) {
        logger.error(
          "CreateUserUseCase",
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
