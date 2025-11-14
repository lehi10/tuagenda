import { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import { Business } from "@/server/core/domain/entities/Business";
import { logger } from "@/server/lib/logger";

export interface GetBusinessBySlugInput {
  slug: string;
}

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

  async execute(
    input: GetBusinessBySlugInput
  ): Promise<GetBusinessBySlugResult> {
    try {
      logger.info(
        "GetBusinessBySlugUseCase",
        "system",
        `Fetching business with slug: ${input.slug}`
      );

      const business = await this.businessRepository.findBySlug(input.slug);

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
      logger.error(
        "GetBusinessBySlugUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to fetch business" };
    }
  }
}
