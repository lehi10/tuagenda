/**
 * Delete BusinessUser Server Action
 *
 * This server action handles deleting a business-user relationship.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business-user
 */

"use server";

import {
  DeleteBusinessUserUseCase,
  DeleteBusinessUserInput,
} from "@/core/application/use-cases/business-user";
import {
  PrismaBusinessUserRepository,
  PrismaUserRepository,
} from "@/infrastructure/repositories";

/**
 * Result type for the delete business-user action
 */
type DeleteBusinessUserResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Deletes a business-user relationship
 *
 * This function should be called to remove a user from a business.
 *
 * @param data - Business-user relationship ID
 * @returns Result object with success status or error message
 *
 * @example
 * ```typescript
 * const result = await deleteBusinessUser({ id: 1 });
 *
 * if (result.success) {
 *   console.log('BusinessUser deleted successfully');
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function deleteBusinessUser(
  data: DeleteBusinessUserInput
): Promise<DeleteBusinessUserResult> {
  // Dependency injection: Create repository and use case
  const businessUserRepository = new PrismaBusinessUserRepository();
  const userRepository = new PrismaUserRepository();
  const deleteBusinessUserUseCase = new DeleteBusinessUserUseCase(
    businessUserRepository,
    userRepository
  );

  // Execute use case
  const result = await deleteBusinessUserUseCase.execute(data);

  // Return domain result directly
  if (result.success) {
    return {
      success: true,
    };
  }

  return {
    success: false,
    error: result.error || "Failed to delete business-user relationship",
  };
}
