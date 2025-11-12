/**
 * Get User Server Action
 *
 * Fetches user data from PostgreSQL database by Firebase UID.
 * This is used after Firebase authentication to get the full user profile.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import { UserProps } from "@/core/domain/entities/User";
import { GetUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { validateAndExecute } from "@/lib/utils/action-validator";

// Schema validation
const getUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type GetUserInput = z.infer<typeof getUserSchema>;

type GetUserResult =
  | { success: true; user: UserProps }
  | { success: false; error: string };

/**
 * Fetches user data from database by Firebase UID
 *
 * @param input - Input with userId to fetch
 * @returns Result object with user data or error message
 */
export async function getUserByIdAction(
  input: unknown
): Promise<GetUserResult> {
  return validateAndExecute(
    getUserSchema,
    input,
    async (validated) => {
      const userRepository = new PrismaUserRepository();
      const getUserUseCase = new GetUserUseCase(userRepository);

      const result = await getUserUseCase.execute({ id: validated.userId });

      if (result.success && result.user) {
        return {
          success: true,
          user: result.user.toObject(),
        };
      }

      return {
        success: false,
        error: result.error || "User not found",
      };
    },
    { errorMessage: "An unexpected error occurred while fetching user" }
  );
}
