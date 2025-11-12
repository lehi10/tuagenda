/**
 * Search Users Server Action
 *
 * This server action searches for users by email or name.
 * Used for adding employees to a business.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import { SearchUsersUseCase } from "@/core/application/use-cases/user";
import type { SearchUsersResult } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { validateAndExecute } from "@/lib/utils/action-validator";

// Schema validation
const searchUsersSchema = z.object({
  search: z.string().min(1, "Search term is required"),
  limit: z.number().int().positive().optional(),
});

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

/**
 * Search for users by email or name
 *
 * @param input - Input with search term and optional limit
 * @returns Result object with matching users
 */
export async function searchUsersAction(
  input: unknown
): Promise<SearchUsersResult> {
  return validateAndExecute(
    searchUsersSchema,
    input,
    async (validated) => {
      const userRepository = new PrismaUserRepository();
      const searchUsersUseCase = new SearchUsersUseCase(userRepository);

      const result = await searchUsersUseCase.execute(validated);

      return {
        success: result.success,
        users: result.users,
        error: result.error,
      };
    },
    { errorMessage: "An unexpected error occurred while searching users" }
  );
}
