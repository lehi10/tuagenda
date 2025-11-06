/**
 * Business-User API Routes
 * PATCH /api/business-user/[id] - Update business-user relationship
 * DELETE /api/business-user/[id] - Delete business-user relationship
 */

import {
  UpdateBusinessUserUseCase,
  UpdateBusinessUserInput,
  DeleteBusinessUserUseCase,
} from "@/core/application/use-cases/business-user";
import {
  PrismaBusinessUserRepository,
  PrismaUserRepository,
} from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data: UpdateBusinessUserInput = {
      id: parseInt(params.id),
      ...body,
    };

    const businessUserRepository = new PrismaBusinessUserRepository();
    const updateBusinessUserUseCase = new UpdateBusinessUserUseCase(
      businessUserRepository
    );

    const result = await updateBusinessUserUseCase.execute(data);

    if (result.success && result.businessUser) {
      return Response.json({
        success: true,
        businessUser: result.businessUser.toObject(),
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to update business-user relationship",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:PATCH /api/business-user/[id]",
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const businessUserRepository = new PrismaBusinessUserRepository();
    const userRepository = new PrismaUserRepository();
    const deleteBusinessUserUseCase = new DeleteBusinessUserUseCase(
      businessUserRepository,
      userRepository
    );

    const result = await deleteBusinessUserUseCase.execute({
      id: parseInt(params.id),
    });

    if (result.success) {
      return Response.json({ success: true });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to delete business-user relationship",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:DELETE /api/business-user/[id]",
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
