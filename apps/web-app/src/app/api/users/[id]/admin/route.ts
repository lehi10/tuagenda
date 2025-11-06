/**
 * User Admin API Route
 * PATCH /api/users/[id]/admin - Update user type and status (Admin only)
 */

import { UpdateUserAdminUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";
import { z } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const body = await request.json();

    // Dependency injection
    const userRepository = new PrismaUserRepository();
    const updateUserAdminUseCase = new UpdateUserAdminUseCase(userRepository);

    // Execute use case
    const result = await updateUserAdminUseCase.execute({
      userId,
      ...body,
    });

    if (result.success) {
      return Response.json({
        success: true,
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to update user",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:PATCH /api/users/[id]/admin",
      userId,
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
