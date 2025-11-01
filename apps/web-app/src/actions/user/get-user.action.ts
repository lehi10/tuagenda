/**
 * Get User Server Action
 *
 * Fetches user data from PostgreSQL database by Firebase UID.
 * This is used after Firebase authentication to get the full user profile.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/user
 */

"use server";

import type { User } from "@/lib/db/prisma";
import { GetUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { UserToPrismaType } from "@/infrastructure/mappers/UserToPrismaType";

/**
 * Result type for the get user action
 */
type GetUserResult =
  | { success: true; user: User }
  | { success: false; error: string };

/**
 * Fetches user data from database by Firebase UID
 *
 * @param firebaseUid - The Firebase UID of the user
 * @returns Result object with user data or error message
 *
 * @example
 * ```typescript
 * const result = await getUserById(firebaseUser.uid);
 *
 * if (result.success) {
 *   console.log('User data:', result.user);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getUserById(firebaseUid: string): Promise<GetUserResult> {
  // Dependency injection: Create repository and use case
  const userRepository = new PrismaUserRepository();
  const getUserUseCase = new GetUserUseCase(userRepository);

  // Execute use case
  const result = await getUserUseCase.execute({ id: firebaseUid });

  // Map domain result to action result (backward compatible with Prisma type)
  if (result.success && result.user) {
    return {
      success: true,
      user: UserToPrismaType.toPrismaType(result.user),
    };
  }

  return {
    success: false,
    error: result.error || "User not found",
  };
}
