/**
 * Update BusinessUser Server Action
 *
 * This server action handles updating an existing business-user relationship.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business-user
 */

"use server";

import { BusinessUserProps } from "@/core/domain/entities";
import {
  UpdateBusinessUserUseCase,
  UpdateBusinessUserInput,
} from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";

/**
 * Result type for the update business-user action
 */
type UpdateBusinessUserResult =
  | { success: true; businessUser: BusinessUserProps }
  | { success: false; error: string };

/**
 * Updates an existing business-user relationship (mainly the role)
 *
 * This function should be called to change a user's role in a business.
 *
 * @param data - Business-user relationship update data
 * @returns Result object with success status and updated business-user data or error message
 *
 * @example
 * ```typescript
 * const result = await updateBusinessUser({
 *   id: 1,
 *   role: BusinessRole.MANAGER,
 * });
 *
 * if (result.success) {
 *   console.log('BusinessUser updated:', result.businessUser);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function updateBusinessUser(
  data: UpdateBusinessUserInput
): Promise<UpdateBusinessUserResult> {
  // Dependency injection: Create repository and use case
  const businessUserRepository = new PrismaBusinessUserRepository();
  const updateBusinessUserUseCase = new UpdateBusinessUserUseCase(
    businessUserRepository
  );

  // Execute use case
  const result = await updateBusinessUserUseCase.execute(data);

  // Return domain result directly
  if (result.success && result.businessUser) {
    return {
      success: true,
      businessUser: result.businessUser.toObject(),
    };
  }

  return {
    success: false,
    error: result.error || "Failed to update business-user relationship",
  };
}
