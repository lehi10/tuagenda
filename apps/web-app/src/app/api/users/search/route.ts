/**
 * Search Users API Route
 * GET /api/users/search?q=term&limit=10
 */

import { SearchUsersUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    // Dependency injection
    const userRepository = new PrismaUserRepository();
    const searchUsersUseCase = new SearchUsersUseCase(userRepository);

    // Execute use case
    const result = await searchUsersUseCase.execute({ search, limit });

    if (result.success) {
      return Response.json({
        success: true,
        users: result.users,
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to search users",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:GET /api/users/search",
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
