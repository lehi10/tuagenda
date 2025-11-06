/**
 * Business-User API Routes
 * GET /api/business-user/by-business/[businessId] - Get all users for a business
 *
 * Query params:
 * - role: Filter by role (optional)
 * - limit: Limit results (optional)
 * - offset: Offset for pagination (optional)
 * - details: Include user details (optional, default: false)
 */

import {
  GetBusinessUsersByBusinessUseCase,
  GetBusinessUsersByBusinessInput,
  GetBusinessUsersWithDetailsUseCase,
} from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";
import { BusinessRole } from "@/core/domain/entities";

export async function GET(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get("details") === "true";
    const search = searchParams.get("search") || undefined;

    const businessId = parseInt(params.businessId);

    if (includeDetails) {
      // Use hexagonal architecture with dedicated Use Case
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersWithDetailsUseCase =
        new GetBusinessUsersWithDetailsUseCase(businessUserRepository);

      const result = await getBusinessUsersWithDetailsUseCase.execute({
        businessId,
        search,
      });

      if (result.success && result.businessUsers) {
        return Response.json({
          success: true,
          businessUsers: result.businessUsers,
        });
      }

      return Response.json(
        {
          success: false,
          error: result.error || "Failed to get business users with details",
        },
        { status: 400 }
      );
    }

    // Use hexagonal architecture
    const role = searchParams.get("role") as BusinessRole | undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    const data: GetBusinessUsersByBusinessInput = {
      businessId,
      role,
      limit,
      offset,
    };

    const businessUserRepository = new PrismaBusinessUserRepository();
    const getBusinessUsersByBusinessUseCase =
      new GetBusinessUsersByBusinessUseCase(businessUserRepository);

    const result = await getBusinessUsersByBusinessUseCase.execute(data);

    if (result.success && result.businessUsers) {
      return Response.json({
        success: true,
        businessUsers: result.businessUsers.map((bu) => bu.toObject()),
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to get business users",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error(
      "API:GET /api/business-user/by-business/[businessId]",
      params.businessId,
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
