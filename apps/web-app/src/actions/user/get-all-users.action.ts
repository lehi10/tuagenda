/**
 * Get All Users Server Action
 *
 * This server action retrieves all users from the system with comprehensive filtering.
 * More complete than searchUsersAction - includes type, status, and pagination support.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses UserProps from domain instead of custom interfaces.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import {
  UserProps,
  UserType,
  UserStatus,
  User,
} from "@/core/domain/entities/User";
import { GetAllUsersUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { validateAndExecute } from "@/lib/utils/action-validator";

// Schema validation
const getAllUsersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(UserType).optional(),
  status: z.enum(UserStatus).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

export type GetAllUsersInput = z.infer<typeof getAllUsersSchema>;

// Export type for UI components
export type UserListItem = UserProps;

export interface GetAllUsersResult {
  success: boolean;
  users?: UserProps[];
  total?: number;
  error?: string;
}

/**
 * Get all users from the system with optional filtering
 *
 * @param filters - Optional filters for search, type, status, pagination
 * @returns Result with users array and total count
 */
export async function getAllUsersAction(
  filters?: unknown
): Promise<GetAllUsersResult> {
  return validateAndExecute(
    getAllUsersSchema,
    filters || {},
    async (validated) => {
      const userRepository = new PrismaUserRepository();
      const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
      const result = await getAllUsersUseCase.execute(validated);

      if (result.success && result.users) {
        return {
          success: true,
          users: result.users.map((user: User) => user.toObject()),
          total: result.total,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to fetch users",
      };
    },
    { errorMessage: "An unexpected error occurred while fetching users" }
  );
}
