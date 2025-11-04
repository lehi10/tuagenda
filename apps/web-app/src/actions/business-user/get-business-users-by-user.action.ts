/**
 * Get BusinessUsers By User Server Action
 *
 * This server action handles retrieving all businesses associated with a user.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business-user
 */

"use server";

import { BusinessUserProps } from "@/core/domain/entities";
import {
  GetBusinessUsersByUserUseCase,
  GetBusinessUsersByUserInput,
} from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";

/**
 * Result type for the get business users by user action
 */
type GetBusinessUsersByUserResult =
  | { success: true; businessUsers: BusinessUserProps[] }
  | { success: false; error: string };

/**
 * Gets all businesses associated with a user
 *
 * This function should be called to retrieve the list of businesses a user belongs to.
 *
 * @param data - Query parameters (userId, optional filters)
 * @returns Result object with success status and business-user list or error message
 *
 * @example
 * ```typescript
 * const result = await getBusinessUsersByUser({
 *   userId: 'firebase-uid',
 *   role: BusinessRole.MANAGER,
 *   limit: 10,
 *   offset: 0,
 * });
 *
 * if (result.success) {
 *   console.log('User businesses:', result.businessUsers);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getBusinessUsersByUser(
  data: GetBusinessUsersByUserInput
): Promise<GetBusinessUsersByUserResult> {
  // Dependency injection: Create repository and use case
  const businessUserRepository = new PrismaBusinessUserRepository();
  const getBusinessUsersByUserUseCase = new GetBusinessUsersByUserUseCase(
    businessUserRepository
  );

  // Execute use case
  const result = await getBusinessUsersByUserUseCase.execute(data);

  // Return domain result directly
  if (result.success && result.businessUsers) {
    return {
      success: true,
      businessUsers: result.businessUsers.map((bu) => bu.toObject()),
    };
  }

  return {
    success: false,
    error: result.error || "Failed to get user businesses",
  };
}
