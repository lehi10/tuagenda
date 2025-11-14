/**
 * Create Business Server Action
 *
 * Creates a new business in the database.
 * This is used when creating a new business from the dashboard.
 *
 * @module actions/business
 */

"use server";

import { z } from "zod";
import { BusinessProps } from "@/server/core/domain/entities/Business";
import { CreateBusinessUseCase } from "@/server/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/server/infrastructure/repositories";
import { validatePrivateAction } from "@/server/lib/utils/action-validator";

// Schema validation
const createBusinessSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  domain: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  timeZone: z.string().min(1, "Time zone is required"),
  locale: z.string().min(1, "Locale is required"),
  currency: z.string().min(1, "Currency is required"),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  website: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

type CreateBusinessResult =
  | { success: true; business: BusinessProps }
  | { success: false; error: string };

/**
 * Creates a new business in the database
 *
 * @param input - Business data to create
 * @returns Result object with created business or error message
 */
export async function createBusiness(
  input: unknown
): Promise<CreateBusinessResult> {
  return validatePrivateAction(
    createBusinessSchema,
    input,
    async (validated) => {
      const businessRepository = new PrismaBusinessRepository();
      const createBusinessUseCase = new CreateBusinessUseCase(
        businessRepository
      );
      const result = await createBusinessUseCase.execute(validated);

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
    },
    { errorMessage: "An unexpected error occurred while creating the business" }
  );
}
