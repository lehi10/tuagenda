/**
 * Business By Slug API Route
 * GET /api/business/slug/[slug] - Get business by slug (PUBLIC)
 *
 * PUBLIC ENDPOINT - No authentication required
 * Used for public booking flows and business profile pages
 */

import { GetBusinessBySlugUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const businessRepository = new PrismaBusinessRepository();
    const getBusinessBySlugUseCase = new GetBusinessBySlugUseCase(
      businessRepository
    );

    const result = await getBusinessBySlugUseCase.execute({
      slug: params.slug,
    });

    if (result.success && result.business) {
      return Response.json({
        success: true,
        business: result.business.toObject(),
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Business not found",
      },
      { status: 404 }
    );
  } catch (error) {
    logger.error(
      "API:GET /api/business/slug/[slug]",
      params.slug,
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred while fetching the business",
      },
      { status: 500 }
    );
  }
}
