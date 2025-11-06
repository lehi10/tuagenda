/**
 * Business API Routes
 * GET /api/business/[id] - Get business by ID
 * PATCH /api/business/[id] - Update business
 * DELETE /api/business/[id] - Delete business
 */

import {
  GetBusinessUseCase,
  UpdateBusinessUseCase,
  DeleteBusinessUseCase,
} from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const businessRepository = new PrismaBusinessRepository();
    const getBusinessUseCase = new GetBusinessUseCase(businessRepository);

    const result = await getBusinessUseCase.execute({
      id: parseInt(params.id),
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
      "API:GET /api/business/[id]",
      params.id,
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const businessRepository = new PrismaBusinessRepository();
    const updateBusinessUseCase = new UpdateBusinessUseCase(businessRepository);

    const result = await updateBusinessUseCase.execute({
      id: parseInt(params.id),
      ...data,
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
        error: result.error || "Failed to update business",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:PATCH /api/business/[id]",
      params.id,
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred while updating the business",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const businessRepository = new PrismaBusinessRepository();
    const deleteBusinessUseCase = new DeleteBusinessUseCase(businessRepository);

    const result = await deleteBusinessUseCase.execute({
      id: parseInt(params.id),
    });

    if (result.success) {
      return Response.json({ success: true });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to delete business",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:DELETE /api/business/[id]",
      params.id,
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred while deleting the business",
      },
      { status: 500 }
    );
  }
}
