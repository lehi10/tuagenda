/**
 * Delete Business Server Action
 *
 * Deletes a business from the database.
 * This is used when removing a business from the dashboard.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/business
 */

"use server";

import { DeleteBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

/**
 * Result type for the delete business action
 */
type DeleteBusinessResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Deletes a business from the database
 *
 * @param id - The ID of the business to delete
 * @returns Result object indicating success or error message
 *
 * @example
 * ```typescript
 * const result = await deleteBusiness(1);
 *
 * if (result.success) {
 *   console.log('Business deleted successfully');
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function deleteBusiness(
  id: number
): Promise<DeleteBusinessResult> {
  try {
    // Dependency injection: Create repository and use case
    const businessRepository = new PrismaBusinessRepository();
    const deleteBusinessUseCase = new DeleteBusinessUseCase(businessRepository);

    // Execute use case
    const result = await deleteBusinessUseCase.execute({ id });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.error || "Failed to delete business",
    };
  } catch (error) {
    console.error("Error in deleteBusiness action:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the business",
    };
  }
}
