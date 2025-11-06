/**
 * User Admin API Route
 * PATCH /api/users/[id]/admin - Update user type and status (Admin only)
 */

import { PrismaUserRepository } from "@/infrastructure/repositories";
import { logger } from "@/lib/logger";
import { UserType, UserStatus } from "@/core/domain/entities/User";
import { syncUserType } from "@/lib/auth/authorization";
import { z } from "zod";

const updateUserAdminSchema = z.object({
  type: z.nativeEnum(UserType).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const body = await request.json();
    const validatedData = updateUserAdminSchema.parse(body);

    // Check if there's anything to update
    if (!validatedData.type && !validatedData.status) {
      return Response.json(
        {
          success: false,
          error: "No fields to update",
        },
        { status: 400 }
      );
    }

    const userRepository = new PrismaUserRepository();

    // Get current user if type is being updated
    let oldUserType: UserType | undefined;
    if (validatedData.type) {
      const currentUser = await userRepository.findById(userId);
      oldUserType = currentUser?.type;
    }

    // Update user
    await userRepository.updateAdmin(userId, validatedData);

    // Sync user type with authorization system if type changed
    if (validatedData.type && oldUserType !== validatedData.type) {
      logger.info(
        "API:PATCH /api/users/[id]/admin",
        userId,
        `Syncing user type change: ${oldUserType} -> ${validatedData.type}`
      );

      // Remove old user type
      if (oldUserType && oldUserType !== UserType.CUSTOMER) {
        await syncUserType(
          userId,
          oldUserType === UserType.ADMIN ? "admin" : "superadmin",
          "remove"
        );
      }

      // Add new user type
      if (validatedData.type !== UserType.CUSTOMER) {
        await syncUserType(
          userId,
          validatedData.type === UserType.ADMIN ? "admin" : "superadmin",
          "add"
        );
      }
    }

    logger.info("API:PATCH /api/users/[id]/admin", userId, "User updated successfully");

    return Response.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e) => e.message).join(", ");
      logger.error("API:PATCH /api/users/[id]/admin", userId, `Validation error: ${errorMessage}`);
      return Response.json(
        {
          success: false,
          error: `Validation error: ${errorMessage}`,
        },
        { status: 400 }
      );
    }

    logger.error("API:PATCH /api/users/[id]/admin", userId, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
