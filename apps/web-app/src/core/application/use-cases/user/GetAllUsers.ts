/**
 * Get All Users Use Case
 *
 * Fetches all users with optional filtering and pagination.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 */

import {
  IUserRepository,
  UserRepositoryFilters,
} from "@/core/domain/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { logger } from "@/lib/logger";
import { UserType, UserStatus } from "@/core/domain/entities/User";

export interface GetAllUsersInput {
  search?: string;
  type?: UserType;
  status?: UserStatus;
  limit?: number;
  offset?: number;
}

export interface GetAllUsersResult {
  success: boolean;
  users?: User[];
  total?: number;
  error?: string;
}

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetAllUsersInput = {}): Promise<GetAllUsersResult> {
    try {
      logger.info("GetAllUsersUseCase", "system", "Fetching all users");

      const filters: UserRepositoryFilters = {
        search: input.search,
        type: input.type,
        status: input.status,
        limit: input.limit,
        offset: input.offset,
      };

      const users = await this.userRepository.findAll(filters);
      const total = await this.userRepository.count(filters);

      logger.info(
        "GetAllUsersUseCase",
        "system",
        `Found ${users.length} users (total: ${total})`
      );

      return {
        success: true,
        users,
        total,
      };
    } catch (error) {
      logger.error(
        "GetAllUsersUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error: "Failed to fetch users",
      };
    }
  }
}
