/**
 * Business API Routes
 * POST /api/business - Create business
 * GET /api/business - List all businesses
 */

import { CreateBusinessUseCase } from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const businessRepository = new PrismaBusinessRepository();
    const createBusinessUseCase = new CreateBusinessUseCase(businessRepository);

    const result = await createBusinessUseCase.execute(data);

    if (result.success && result.business) {
      return Response.json({
        success: true,
        business: result.business.toObject(),
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to create business",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error("API:POST /api/business", "system", `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred while creating the business",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const businessRepository = new PrismaBusinessRepository();
    const businesses = await businessRepository.findAll();

    return Response.json({
      success: true,
      businesses: businesses.map(b => b.toObject()),
    });
  } catch (error) {
    logger.error("API:GET /api/business", "system", `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred while fetching businesses",
      },
      { status: 500 }
    );
  }
}
