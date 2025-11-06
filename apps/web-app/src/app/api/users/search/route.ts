/**
 * Search Users API Route
 * GET /api/users/search?q=term&limit=10
 */

import { PrismaUserRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!search || search.trim().length < 2) {
      return Response.json({
        success: true,
        users: [],
      });
    }

    // Use repository method
    const userRepository = new PrismaUserRepository();
    const users = await userRepository.search(search, limit);

    return Response.json({
      success: true,
      users,
    });
  } catch (error) {
    logger.error("API:GET /api/users/search", "system", `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "Failed to search users",
      },
      { status: 500 }
    );
  }
}
