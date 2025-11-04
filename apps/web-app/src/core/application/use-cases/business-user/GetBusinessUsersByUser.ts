/**
 * Get BusinessUsers By User Use Case
 *
 * This use case handles retrieving all businesses associated with a user.
 * It validates input and fetches the relationships using the repository.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import {
  BusinessUser,
  BusinessRole,
} from "@/core/domain/entities/BusinessUser";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for getting user's businesses
 */
const getBusinessUsersByUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(BusinessRole).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

export type GetBusinessUsersByUserInput = z.infer<
  typeof getBusinessUsersByUserSchema
>;

export interface GetBusinessUsersByUserResult {
  success: boolean;
  businessUsers?: BusinessUser[];
  error?: string;
}

/**
 * Get BusinessUsers By User Use Case
 *
 * Business logic for retrieving user's businesses:
 * 1. Validate input data
 * 2. Fetch relationships using repository
 * 3. Return results
 */
export class GetBusinessUsersByUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(input: unknown): Promise<GetBusinessUsersByUserResult> {
    try {
      // 1. Validate input
      logger.info(
        "GetBusinessUsersByUserUseCase",
        "system",
        "Validating input data"
      );
      const validatedData = getBusinessUsersByUserSchema.parse(input);

      logger.info(
        "GetBusinessUsersByUserUseCase",
        validatedData.userId,
        "Fetching businesses for user"
      );

      // 2. Fetch relationships using repository
      const businessUsers = await this.businessUserRepository.findByUser(
        validatedData.userId,
        {
          role: validatedData.role,
          limit: validatedData.limit,
          offset: validatedData.offset,
        }
      );

      logger.info(
        "GetBusinessUsersByUserUseCase",
        validatedData.userId,
        `Found ${businessUsers.length} businesses for user`
      );

      return {
        success: true,
        businessUsers,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map((e) => e.message).join(", ");
        logger.error(
          "GetBusinessUsersByUserUseCase",
          "system",
          `Validation error: ${errorMessage}`
        );
        return {
          success: false,
          error: `Validation error: ${errorMessage}`,
        };
      }

      logger.error(
        "GetBusinessUsersByUserUseCase",
        "system",
        `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
}
