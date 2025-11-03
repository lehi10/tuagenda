/**
 * Create BusinessUser Server Action
 *
 * This server action handles creating a new business-user relationship.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business-user
 */

"use server";

import { BusinessRole, BusinessUserProps } from "@/core/domain/entities";
import {
  CreateBusinessUserUseCase,
  CreateBusinessUserInput,
} from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";

/**
 * Result type for the create business-user action
 */
type CreateBusinessUserResult =
  | { success: true; businessUser: BusinessUserProps }
  | { success: false; error: string };

/**
 * Creates a new business-user relationship
 *
 * This function should be called to associate a user with a business.
 *
 * @param data - Business-user relationship data
 * @returns Result object with success status and business-user data or error message
 *
 * @example
 * ```typescript
 * const result = await createBusinessUser({
 *   userId: 'firebase-uid',
 *   businessId: 1,
 *   role: BusinessRole.EMPLOYEE,
 * });
 *
 * if (result.success) {
 *   console.log('BusinessUser created:', result.businessUser);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function createBusinessUser(
  data: CreateBusinessUserInput
): Promise<CreateBusinessUserResult> {
  // Dependency injection: Create repository and use case
  const businessUserRepository = new PrismaBusinessUserRepository();
  const createBusinessUserUseCase = new CreateBusinessUserUseCase(
    businessUserRepository
  );

  // Execute use case
  const result = await createBusinessUserUseCase.execute(data);

  // Return domain result directly
  if (result.success && result.businessUser) {
    return {
      success: true,
      businessUser: result.businessUser.toObject(),
    };
  }

  return {
    success: false,
    error: result.error || "Failed to create business-user relationship",
  };
}
