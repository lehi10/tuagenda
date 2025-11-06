/**
 * User API Routes
 * GET /api/users/[id] - Get user by Firebase UID
 * PATCH /api/users/[id] - Update user profile
 * DELETE /api/users/[id] - Delete user
 */

import { GetUserUseCase, UpdateUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import {
  updateProfilePersonalInfoSchema,
  type UpdateProfilePersonalInfoInput,
} from "@/lib/validations/user.schema";
import { logger } from "@/lib/logger";
import { prisma } from "db";
import { z } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Dependency injection
    const userRepository = new PrismaUserRepository();
    const getUserUseCase = new GetUserUseCase(userRepository);

    // Execute use case
    const result = await getUserUseCase.execute({ id: params.id });

    // Return result
    if (result.success && result.user) {
      return Response.json({
        success: true,
        user: result.user.toObject(),
      });
    }

    return Response.json(
      {
        success: false,
        error: result.error || "User not found",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in GET /api/users/[id]:", error);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  logger.info("UPDATE_USER", userId, "Starting profile update");

  try {
    const data: UpdateProfilePersonalInfoInput = await request.json();

    // Validate input data
    const validatedData = updateProfilePersonalInfoSchema.parse(data);
    logger.info("UPDATE_USER", userId, "Data validated successfully");

    // Dependency injection
    const userRepository = new PrismaUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);

    // Convert empty strings to null for optional fields
    const updateInput = {
      id: userId,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      birthday: validatedData.birthday || null,
      phone: validatedData.phone || null,
      countryCode: validatedData.countryCode || null,
      timeZone: validatedData.timeZone || null,
    };

    // Execute use case
    const result = await updateUserUseCase.execute(updateInput);

    if (result.success) {
      logger.info(
        "UPDATE_USER",
        userId,
        `Profile updated successfully - ${result.user.email}`
      );

      return Response.json({
        success: true,
        message: "Profile updated successfully",
      });
    }

    logger.error("UPDATE_USER", userId, `Update failed: ${result.error}`);
    return Response.json(
      {
        success: false,
        error: result.error,
      },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      logger.error("UPDATE_USER", userId, `Validation error: ${error.message}`);
      return Response.json(
        {
          success: false,
          error: "Invalid data provided. Please check your input.",
        },
        { status: 400 }
      );
    }

    logger.error(
      "UPDATE_USER",
      userId,
      `Error updating profile: ${error instanceof Error ? error.message : "Unknown error"}`
    );

    return Response.json(
      {
        success: false,
        error: "Failed to update profile. Please try again.",
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
    // Use repository directly
    const userRepository = new PrismaUserRepository();

    // Check if user exists
    const existingUser = await userRepository.findById(params.id);
    if (!existingUser) {
      logger.warning("API:DELETE /api/users/[id]", params.id, "User not found");
      return Response.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Delete user
    await userRepository.delete(params.id);

    logger.info("API:DELETE /api/users/[id]", params.id, "User deleted successfully");

    return Response.json({
      success: true,
    });
  } catch (error) {
    logger.error("API:DELETE /api/users/[id]", params.id, `Error: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
