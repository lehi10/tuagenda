import { IBusinessRepository } from "@/core/domain/repositories/IBusinessRepository";
import { Business } from "@/core/domain/entities/Business";
import { z } from "zod";
import { logger } from "@/lib/logger";

const getBusinessBySlugSchema = z.object({
  slug: z.string().min(1, "Business slug cannot be empty"),
});

export type GetBusinessBySlugInput = z.infer<typeof getBusinessBySlugSchema>;

export interface GetBusinessBySlugResult {
  success: boolean;
  business?: Business;
  error?: string;
}

/**
 * Get Business By Slug Use Case
 *
 * This use case is specifically designed for PUBLIC booking flows.
 * It retrieves business information using a slug (URL-friendly identifier)
 * without requiring authentication or authorization.
 *
 * Use this for:
 * - Public booking pages (/book/my-business-slug)
 * - Business profile pages
 * - Any public-facing business information
 */
export class GetBusinessBySlugUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: unknown): Promise<GetBusinessBySlugResult> {
    try {
      const validatedData = getBusinessBySlugSchema.parse(input);
      logger.info(
        "GetBusinessBySlugUseCase",
        "system",
        `Fetching business with slug: ${validatedData.slug}`
      );

      const business = await this.businessRepository.findBySlug(
        validatedData.slug
      );

      if (!business) {
        logger.info("GetBusinessBySlugUseCase", "system", "Business not found");
        return { success: false, error: "Business not found" };
      }

      logger.info(
        "GetBusinessBySlugUseCase",
        "system",
        "Business retrieved successfully"
      );
      return { success: true, business };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }
      logger.error(
        "GetBusinessBySlugUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to fetch business" };
    }
  }
}
