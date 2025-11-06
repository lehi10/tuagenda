/**
 * Get All Users Use Case
 *
 * Fetches all users with optional filtering and pagination.
 */

import {
  IUserRepository,
  UserRepositoryFilters,
} from "@/core/domain/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { UserType, UserStatus } from "@/core/domain/entities/User";

const getAllUsersSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(UserType).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

export type GetAllUsersInput = z.infer<typeof getAllUsersSchema>;

export interface GetAllUsersResult {
  success: boolean;
  users?: User[];
  total?: number;
  error?: string;
}

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: unknown = {}): Promise<GetAllUsersResult> {
    try {
      const validatedData = getAllUsersSchema.parse(input);

      logger.info("GetAllUsersUseCase", "system", "Fetching all users");

      const filters: UserRepositoryFilters = {
        search: validatedData.search,
        type: validatedData.type,
        status: validatedData.status,
        limit: validatedData.limit,
        offset: validatedData.offset,
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
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }

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
