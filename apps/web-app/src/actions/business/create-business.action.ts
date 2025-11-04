/**
 * Create Business Server Action
 *
 * Creates a new business in the database.
 * This is used when creating a new business from the dashboard.
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module actions/business
 */

"use server";

import { BusinessProps } from "@/core/domain/entities/Business";
import { CreateBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

/**
 * Input data for creating a business
 */
export interface CreateBusinessInput {
  title: string;
  slug: string;
  domain?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  timeZone: string;
  locale: string;
  currency: string;
  status?: "active" | "inactive" | "suspended";
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Result type for the create business action
 */
type CreateBusinessResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Creates a new business in the database
 *
 * @param data - Business data to create
 * @returns Result object with created business or error message
 *
 * @example
 * ```typescript
 * const result = await createBusiness({
 *   title: 'Mi Negocio',
 *   slug: 'mi-negocio',
 *   email: 'contact@negocio.com',
 *   phone: '+56912345678',
 *   address: 'Av. Principal 123',
 *   city: 'Santiago',
 *   country: 'Chile',
 *   timeZone: 'America/Santiago',
 *   locale: 'es-CL',
 *   currency: 'CLP'
 * });
 *
 * if (result.success) {
 *   console.log('Business created:', result.business);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function createBusiness(
  data: CreateBusinessInput
): Promise<CreateBusinessResult> {
  try {
    // Dependency injection: Create repository and use case
    const businessRepository = new PrismaBusinessRepository();
    const createBusinessUseCase = new CreateBusinessUseCase(businessRepository);

    // Execute use case
    const result = await createBusinessUseCase.execute(data);

    // Convert domain entity to plain object for serialization
    if (result.success && result.business) {
      return {
        success: true,
        business: result.business.toObject(),
      };
    }

    return {
      success: false,
      error: result.error || "Failed to create business",
    };
  } catch (error) {
    console.error("Error in createBusiness action:", error);
    return {
      success: false,
      error: "An unexpected error occurred while creating the business",
    };
  }
}
