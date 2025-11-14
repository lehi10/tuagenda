/**
 * List Businesses Server Action
 *
 * Fetches all businesses with optional filtering.
 * This is used to display businesses in the dashboard.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business
 */

"use server";

import { z } from "zod";
import { BusinessProps } from "@/server/core/domain/entities/Business";
import { ListBusinessesUseCase } from "@/server/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/server/infrastructure/repositories";
import { validatePrivateAction } from "@/server/lib/utils/action-validator";

// Schema validation
const listBusinessesSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

export type ListBusinessesFilters = z.infer<typeof listBusinessesSchema>;

type ListBusinessesResult =
  | { success: true; businesses: BusinessProps[]; total: number }
  | { success: false; error: string };

/**
 * Fetches all businesses from database with optional filtering
 *
 * @param filters - Optional filters for searching/filtering businesses
 * @returns Result object with businesses array and total count or error message
 */
export async function listBusinesses(
  filters?: unknown
): Promise<ListBusinessesResult> {
  return validatePrivateAction(
    listBusinessesSchema,
    filters || {},
    async (validated) => {
      const businessRepository = new PrismaBusinessRepository();
      const listBusinessesUseCase = new ListBusinessesUseCase(
        businessRepository
      );
      const result = await listBusinessesUseCase.execute(validated);

      if (result.success && result.businesses) {
        return {
          success: true,
          businesses: result.businesses.map((b) => b.toObject()),
          total: result.total || 0,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to fetch businesses",
      };
    },
    { errorMessage: "An unexpected error occurred while fetching businesses" }
  );
}
