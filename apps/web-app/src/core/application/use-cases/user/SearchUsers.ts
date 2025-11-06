/**
 * Search Users Use Case
 *
 * Searches for users by email or name.
 */

import {
  IUserRepository,
  UserSearchResult,
} from "@/core/domain/repositories/IUserRepository";
import { z } from "zod";
import { logger } from "@/lib/logger";

const searchUsersSchema = z.object({
  search: z.string().min(1, "Search term is required"),
  limit: z.number().int().positive().optional().default(10),
});

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

export interface SearchUsersResult {
  success: boolean;
  users?: UserSearchResult[];
  error?: string;
}

export class SearchUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: unknown): Promise<SearchUsersResult> {
    try {
      const validatedData = searchUsersSchema.parse(input);

      if (validatedData.search.trim().length < 2) {
        return {
          success: true,
          users: [],
        };
      }

      logger.info(
        "SearchUsersUseCase",
        "system",
        `Searching users with term: ${validatedData.search}`
      );

      const users = await this.userRepository.search(
        validatedData.search,
        validatedData.limit
      );

      logger.info(
        "SearchUsersUseCase",
        "system",
        `Found ${users.length} users`
      );

      return {
        success: true,
        users,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }

      logger.error(
        "SearchUsersUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error: "Failed to search users",
      };
    }
  }
}
