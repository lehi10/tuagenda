/**
 * Search Users Use Case
 *
 * Searches for users by email or name.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 */

import {
  IUserRepository,
  UserSearchResult,
} from "@/server/core/domain/repositories/IUserRepository";
import { logger } from "@/server/lib/logger";

export interface SearchUsersInput {
  search: string;
  limit?: number;
}

export interface SearchUsersResult {
  success: boolean;
  users?: UserSearchResult[];
  error?: string;
}

export class SearchUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: SearchUsersInput): Promise<SearchUsersResult> {
    try {
      if (input.search.trim().length < 2) {
        return {
          success: true,
          users: [],
        };
      }

      logger.info(
        "SearchUsersUseCase",
        "system",
        `Searching users with term: ${input.search}`
      );

      const users = await this.userRepository.search(
        input.search,
        input.limit || 10
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
