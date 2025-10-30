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
import { Prisma } from "../../../../../packages/db/generated/prisma";

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
  console.log('[SERVER ACTION] 🚀 createUserInDatabase called with data:', JSON.stringify(data, null, 2));

  try {
    // Validate input data with Zod schema
    console.log('[SERVER ACTION] 📋 Validating data with Zod...');
    const validatedData = createUserFromAuthSchema.parse(data);
    console.log('[SERVER ACTION] ✅ Data validated successfully');

    // Truncate values to prevent database errors
    const firstName = validatedData.firstName.substring(0, 255);
    const lastName = validatedData.lastName.substring(0, 255);
    console.log('[SERVER ACTION] 📏 Truncated names if needed - firstName:', firstName.length, 'lastName:', lastName.length);

    // Check if user already exists
    console.log('[SERVER ACTION] 🔍 Checking if user exists with ID:', validatedData.id);
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.id },
    });

    if (existingUser) {
      // User already exists, return success
      console.log('[SERVER ACTION] ℹ️  User already exists, returning existing user:', existingUser.id);
      return {
        success: true,
        userId: existingUser.id,
      };
    }

    console.log('[SERVER ACTION] 🆕 User does not exist, creating new user...');

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

    console.log('[SERVER ACTION] 🎉 User created successfully:', user.id);

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.error('[SERVER ACTION] ❌ Error occurred:', error);

    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      console.error('[SERVER ACTION] 📛 Zod validation error');
      return {
        success: false,
        error: "Invalid user data provided",
      };
    }

    // Handle Prisma unique constraint violations
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('[SERVER ACTION] 🔒 Prisma error code:', error.code);
      if (error.code === "P2002") {
        return {
          success: false,
          error: "A user with this email already exists",
        };
      }
    }

    // Handle other errors
    console.error("[SERVER ACTION] 💥 Unexpected error creating user in database:", error);
    return {
      success: false,
      error: "Failed to create user. Please try again later.",
    };
  }
}
