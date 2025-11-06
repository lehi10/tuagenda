/**
 * Users API Routes
 * POST /api/users - Create user
 * GET /api/users - Get all users
 */

import { CreateUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { type CreateUserFromAuthInput } from "@/lib/validations/user.schema";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const data: CreateUserFromAuthInput = await request.json();

    // Dependency injection
    const userRepository = new PrismaUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    // Truncate names to prevent database errors
    const truncatedData = {
      ...data,
      firstName: data.firstName.substring(0, 255),
      lastName: data.lastName.substring(0, 255),
    };

    // Execute use case
    const result = await createUserUseCase.execute(truncatedData);

    if (result.success && result.user) {
      return Response.json({
        success: true,
        userId: result.user.id,
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to create user",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error("API:POST /api/users", "system", `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // TODO: Create GetAllUsersUseCase to replace this direct prisma call
    // For now, keeping the same logic as the action
    const userRepository = new PrismaUserRepository();
    const users = await userRepository.findAll();

    return Response.json({
      success: true,
      users,
    });
  } catch (error) {
    logger.error("API:GET /api/users", "system", `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
