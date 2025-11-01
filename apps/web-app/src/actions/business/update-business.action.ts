/**
 * Update Business Server Action
 *
 * Updates an existing business in the database.
 * This is used when editing business information from the dashboard.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/business
 */

"use server";

import { BusinessProps } from "@/core/domain/entities/Business";
import { UpdateBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

/**
 * Input data for updating a business
 */
export interface UpdateBusinessInput {
  id: number;
  title?: string;
  slug?: string;
  domain?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  timeZone?: string;
  locale?: string;
  currency?: string;
  status?: "active" | "inactive" | "suspended";
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Result type for the update business action
 */
type UpdateBusinessResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Updates an existing business in the database
 *
 * @param data - Business data to update (must include id)
 * @returns Result object with updated business or error message
 *
 * @example
 * ```typescript
 * const result = await updateBusiness({
 *   id: 1,
 *   title: 'Mi Negocio Actualizado',
 *   phone: '+56987654321'
 * });
 *
 * if (result.success) {
 *   console.log('Business updated:', result.business);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function updateBusiness(
  data: UpdateBusinessInput
): Promise<UpdateBusinessResult> {
  try {
    // Dependency injection: Create repository and use case
    const businessRepository = new PrismaBusinessRepository();
    const updateBusinessUseCase = new UpdateBusinessUseCase(businessRepository);

    // Execute use case
    const result = await updateBusinessUseCase.execute(data);

    // Convert domain entity to plain object for serialization
    if (result.success && result.business) {
      return {
        success: true,
        business: result.business.toObject(),
      };
    }

    return {
      success: false,
      error: result.error || "Failed to update business",
    };
  } catch (error) {
    console.error("Error in updateBusiness action:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating the business",
    };
  }
}
