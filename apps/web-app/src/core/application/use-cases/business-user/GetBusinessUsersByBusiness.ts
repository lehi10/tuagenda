/**
 * Get BusinessUsers By Business Use Case
 *
 * This use case handles retrieving all users associated with a business.
 * It validates input and fetches the relationships using the repository.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import { BusinessUser, BusinessRole } from "@/core/domain/entities/BusinessUser";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for getting business users
 */
const getBusinessUsersByBusinessSchema = z.object({
  businessId: z.number().int().positive("Business ID must be a positive integer"),
  role: z.nativeEnum(BusinessRole).optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

export type GetBusinessUsersByBusinessInput = z.infer<
  typeof getBusinessUsersByBusinessSchema
>;

export interface GetBusinessUsersByBusinessResult {
  success: boolean;
  businessUsers?: BusinessUser[];
  error?: string;
}

/**
 * Get BusinessUsers By Business Use Case
 *
 * Business logic for retrieving business users:
 * 1. Validate input data
 * 2. Fetch relationships using repository
 * 3. Return results
 */
export class GetBusinessUsersByBusinessUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(input: unknown): Promise<GetBusinessUsersByBusinessResult> {
    try {
      // 1. Validate input
      logger.info(
        "GetBusinessUsersByBusinessUseCase",
        "system",
        "Validating input data"
      );
      const validatedData = getBusinessUsersByBusinessSchema.parse(input);

      logger.info(
        "GetBusinessUsersByBusinessUseCase",
        "system",
        `Fetching users for business ${validatedData.businessId}`
      );

      // 2. Fetch relationships using repository
      const businessUsers = await this.businessUserRepository.findByBusiness(
        validatedData.businessId,
        {
          role: validatedData.role,
          limit: validatedData.limit,
          offset: validatedData.offset,
        }
      );

      logger.info(
        "GetBusinessUsersByBusinessUseCase",
        "system",
        `Found ${businessUsers.length} users for business ${validatedData.businessId}`
      );

      return {
        success: true,
        businessUsers,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => e.message).join(", ");
        logger.error(
          "GetBusinessUsersByBusinessUseCase",
          "system",
          `Validation error: ${errorMessage}`
        );
        return {
          success: false,
          error: `Validation error: ${errorMessage}`,
        };
      }

      logger.error(
        "GetBusinessUsersByBusinessUseCase",
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
