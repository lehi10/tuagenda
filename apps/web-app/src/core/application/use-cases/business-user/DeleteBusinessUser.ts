/**
 * Delete BusinessUser Use Case
 *
 * This use case handles deleting a business-user relationship.
 * It validates input, finds the relationship, and deletes it.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for deleting a business-user relationship
 */
const deleteBusinessUserSchema = z.object({
  id: z.number().int().positive("BusinessUser ID must be a positive integer"),
});

export type DeleteBusinessUserInput = z.infer<typeof deleteBusinessUserSchema>;

export interface DeleteBusinessUserResult {
  success: boolean;
  error?: string;
}

/**
 * Delete BusinessUser Use Case
 *
 * Business logic for deleting a business-user relationship:
 * 1. Validate input data
 * 2. Check if relationship exists
 * 3. Delete using repository
 */
export class DeleteBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(input: unknown): Promise<DeleteBusinessUserResult> {
    try {
      // 1. Validate input
      logger.info(
        "DeleteBusinessUserUseCase",
        "system",
        "Validating input data"
      );
      const validatedData = deleteBusinessUserSchema.parse(input);

      logger.info(
        "DeleteBusinessUserUseCase",
        "system",
        `Deleting BusinessUser ${validatedData.id}`
      );

      // 2. Check if relationship exists
      const existingBusinessUser = await this.businessUserRepository.findById(
        validatedData.id
      );

      if (!existingBusinessUser) {
        logger.error(
          "DeleteBusinessUserUseCase",
          "system",
          `BusinessUser with ID ${validatedData.id} not found`
        );
        return {
          success: false,
          error: "Business-user relationship not found",
        };
      }

      // 3. Delete using repository
      logger.info(
        "DeleteBusinessUserUseCase",
        existingBusinessUser.userId,
        `Deleting relationship for business ${existingBusinessUser.businessId}`
      );

      await this.businessUserRepository.delete(validatedData.id);

      logger.info(
        "DeleteBusinessUserUseCase",
        existingBusinessUser.userId,
        "BusinessUser deleted successfully"
      );

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map((e) => e.message).join(", ");
        logger.error(
          "DeleteBusinessUserUseCase",
          "system",
          `Validation error: ${errorMessage}`
        );
        return {
          success: false,
          error: `Validation error: ${errorMessage}`,
        };
      }

      logger.error(
        "DeleteBusinessUserUseCase",
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
