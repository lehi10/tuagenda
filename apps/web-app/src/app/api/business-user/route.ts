/**
 * Business-User API Routes
 * POST /api/business-user - Create business-user relationship
 */

import {
  CreateBusinessUserUseCase,
  CreateBusinessUserInput,
} from "@/core/application/use-cases/business-user";
import {
  PrismaBusinessUserRepository,
  PrismaUserRepository,
} from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const data: CreateBusinessUserInput = await request.json();

    const businessUserRepository = new PrismaBusinessUserRepository();
    const userRepository = new PrismaUserRepository();
    const createBusinessUserUseCase = new CreateBusinessUserUseCase(
      businessUserRepository,
      userRepository
    );

    const result = await createBusinessUserUseCase.execute(data);

    if (result.success && result.businessUser) {
      return Response.json({
        success: true,
        businessUser: result.businessUser.toObject(),
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "Failed to create business-user relationship",
      },
      { status: 400 }
    );
  } catch (error) {
    logger.error("API:POST /api/business-user", "system", `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
