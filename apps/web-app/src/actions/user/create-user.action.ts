/**
 * Create User Server Action
 *
 * This server action handles creating new users in the PostgreSQL database
 * after they successfully authenticate with Firebase. All new users are
 * created with the 'customer' type by default.
 *
 * @module actions/user
 */

"use server";

import { prisma } from "@/lib/db/prisma";
import {
  createUserFromAuthSchema,
  type CreateUserFromAuthInput,
} from "@/lib/validations/user.schema";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/logger";

/**
 * Result type for the create user action
 */
type CreateUserResult =
  | { success: true; userId: string }
  | { success: false; error: string };

/**
 * Creates a new user in the database with 'customer' type
 *
 * This function should be called after successful Firebase authentication
 * to sync the user data to your PostgreSQL database.
 *
 * @param data - User data from Firebase Auth
 * @returns Result object with success status and user ID or error message
 *
 * @example
 * ```typescript
 * // After successful Firebase signup
 * const result = await createUserInDatabase({
 *   id: firebaseUser.uid,
 *   email: firebaseUser.email,
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   pictureFullPath: firebaseUser.photoURL,
 * });
 *
 * if (result.success) {
 *   console.log('User created:', result.userId);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function createUserInDatabase(
  data: CreateUserFromAuthInput
): Promise<CreateUserResult> {
  logger.info(
    "createUserInDatabase",
    data.id,
    `Server action called with email: ${data.email}, firstName: ${data.firstName}, lastName: ${data.lastName}`
  );

  try {
    // Validate input data with Zod schema
    logger.info(
      "createUserInDatabase",
      data.id,
      "Validating data with Zod schema"
    );
    const validatedData = createUserFromAuthSchema.parse(data);
    logger.info("createUserInDatabase", data.id, "Data validated successfully");

    // Truncate values to prevent database errors
    const firstName = validatedData.firstName.substring(0, 255);
    const lastName = validatedData.lastName.substring(0, 255);
    logger.info(
      "createUserInDatabase",
      data.id,
      `Truncated names if needed - firstName length: ${firstName.length}, lastName length: ${lastName.length}`
    );

    // Check if user already exists
    logger.info(
      "createUserInDatabase",
      validatedData.id,
      "Checking if user already exists in database"
    );
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.id },
    });

    if (existingUser) {
      // User already exists, return success
      logger.info(
        "createUserInDatabase",
        existingUser.id,
        "User already exists, returning existing user"
      );
      return {
        success: true,
        userId: existingUser.id,
      };
    }

    logger.info(
      "createUserInDatabase",
      validatedData.id,
      "User does not exist, creating new user in database"
    );

    // Create new user in database
    // Type is automatically set to 'customer' via Prisma schema default
    // Status is automatically set to 'visible' via Prisma schema default
    const user = await prisma.user.create({
      data: {
        id: validatedData.id,
        email: validatedData.email,
        firstName,
        lastName,
        pictureFullPath: validatedData.pictureFullPath,
        // type: 'customer' <- Not needed, it's the default in schema
        // status: 'visible' <- Not needed, it's the default in schema
      },
    });

    logger.info(
      "createUserInDatabase",
      user.id,
      "User created successfully in database"
    );

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    logger.error(
      "createUserInDatabase",
      data.id,
      `Error occurred: ${error instanceof Error ? error.message : String(error)}`
    );

    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      logger.error(
        "createUserInDatabase",
        data.id,
        "Zod validation error: Invalid user data provided"
      );
      return {
        success: false,
        error: "Invalid user data provided",
      };
    }

    // Handle Prisma unique constraint violations
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(
        "createUserInDatabase",
        data.id,
        `Prisma error code: ${error.code}`
      );
      if (error.code === "P2002") {
        return {
          success: false,
          error: "A user with this email already exists",
        };
      }
    }

    // Handle other errors
    logger.fatal(
      "createUserInDatabase",
      data.id,
      `Unexpected error creating user in database: ${error instanceof Error ? error.message : String(error)}`
    );
    return {
      success: false,
      error: "Failed to create user. Please try again later.",
    };
  }
}
