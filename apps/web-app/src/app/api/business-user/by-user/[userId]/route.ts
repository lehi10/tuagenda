/**
 * Business-User API Routes
 * GET /api/business-user/by-user/[userId] - Get all businesses for a user
 *
 * Query params:
 * - role: Filter by role (optional)
 * - limit: Limit results (optional)
 * - offset: Offset for pagination (optional)
 */

import {
  GetBusinessUsersByUserUseCase,
  GetBusinessUsersByUserInput,
} from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";
import { BusinessRole } from "@/core/domain/entities";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") as BusinessRole | undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    const data: GetBusinessUsersByUserInput = {
      userId: params.userId,
      role,
      limit,
      offset,
    };

    const businessUserRepository = new PrismaBusinessUserRepository();
    const getBusinessUsersByUserUseCase = new GetBusinessUsersByUserUseCase(
      businessUserRepository
    );

    const result = await getBusinessUsersByUserUseCase.execute(data);

    if (result.success && result.businessUsers) {
      return Response.json({
        success: true,
        businessUsers: result.businessUsers.map((bu) => bu.toObject()),
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to get user businesses",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error("API:GET /api/business-user/by-user/[userId]", params.userId, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
