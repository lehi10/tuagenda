/**
 * Users API Routes
 * POST /api/users - Create user
 * GET /api/users - Get all users
 */

import {
  CreateUserUseCase,
  GetAllUsersUseCase,
} from "@/core/application/use-cases/user";
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
    logger.error(
      "API:POST /api/users",
      "system",
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    // Dependency injection
    const userRepository = new PrismaUserRepository();
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

    // Execute use case
    const result = await getAllUsersUseCase.execute({
      search,
      type,
      status,
      limit,
      offset,
    });

    if (result.success) {
      return Response.json({
        success: true,
        users: result.users,
        total: result.total,
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to fetch users",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:GET /api/users",
      "system",
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
