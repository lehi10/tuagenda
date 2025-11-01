/**
 * Create User Server Action
 *
 * This server action handles creating new users in the PostgreSQL database
 * after they successfully authenticate with Firebase. All new users are
 * created with the 'customer' type by default.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/user
 */

"use server";

import { type CreateUserFromAuthInput } from "@/lib/validations/user.schema";
import { CreateUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";

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
  // Dependency injection: Create repository and use case
  const userRepository = new PrismaUserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);

  // Truncate names to prevent database errors
  const truncatedData = {
    ...data,
    firstName: data.firstName.substring(0, 255),
    lastName: data.lastName.substring(0, 255),
  };

  // Execute use case
  const result = await createUserUseCase.execute(truncatedData);

  // Map domain result to action result
  if (result.success && result.user) {
    return {
      success: true,
      userId: result.user.id,
    };
  }

  return {
    success: false,
    error: result.error || "Failed to create user",
  };
}
