/**
 * Get BusinessUsers By Business Server Action
 *
 * This server action handles retrieving all users associated with a business.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business-user
 */

"use server";

import { BusinessUserProps } from "@/core/domain/entities";
import {
  GetBusinessUsersByBusinessUseCase,
  GetBusinessUsersByBusinessInput,
} from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";

/**
 * Result type for the get business users by business action
 */
type GetBusinessUsersByBusinessResult =
  | { success: true; businessUsers: BusinessUserProps[] }
  | { success: false; error: string };

/**
 * Gets all users associated with a business
 *
 * This function should be called to retrieve the list of users in a business.
 *
 * @param data - Query parameters (businessId, optional filters)
 * @returns Result object with success status and business-user list or error message
 *
 * @example
 * ```typescript
 * const result = await getBusinessUsersByBusiness({
 *   businessId: 1,
 *   role: BusinessRole.EMPLOYEE,
 *   limit: 10,
 *   offset: 0,
 * });
 *
 * if (result.success) {
 *   console.log('BusinessUsers:', result.businessUsers);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getBusinessUsersByBusiness(
  data: GetBusinessUsersByBusinessInput
): Promise<GetBusinessUsersByBusinessResult> {
  // Dependency injection: Create repository and use case
  const businessUserRepository = new PrismaBusinessUserRepository();
  const getBusinessUsersByBusinessUseCase =
    new GetBusinessUsersByBusinessUseCase(businessUserRepository);

  // Execute use case
  const result = await getBusinessUsersByBusinessUseCase.execute(data);

  // Return domain result directly
  if (result.success && result.businessUsers) {
    return {
      success: true,
      businessUsers: result.businessUsers.map((bu) => bu.toObject()),
    };
  }

  return {
    success: false,
    error: result.error || "Failed to get business users",
  };
}
