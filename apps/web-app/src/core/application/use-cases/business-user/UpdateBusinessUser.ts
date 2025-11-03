/**
 * Update BusinessUser Use Case
 *
 * This use case handles updating an existing business-user relationship (mainly the role).
 * It validates input, finds the relationship, updates it, and persists changes.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import { BusinessUser, BusinessRole } from "@/core/domain/entities/BusinessUser";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Input schema for updating a business-user relationship
 */
const updateBusinessUserSchema = z.object({
  id: z.number().int().positive("BusinessUser ID must be a positive integer"),
  role: z.nativeEnum(BusinessRole, { errorMap: () => ({ message: "Invalid role" }) }),
});

export type UpdateBusinessUserInput = z.infer<typeof updateBusinessUserSchema>;

export interface UpdateBusinessUserResult {
  success: boolean;
  businessUser?: BusinessUser;
  error?: string;
}

/**
 * Update BusinessUser Use Case
 *
 * Business logic for updating a business-user relationship:
 * 1. Validate input data
 * 2. Find existing relationship
 * 3. Update domain entity
 * 4. Persist changes using repository
 */
export class UpdateBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(input: unknown): Promise<UpdateBusinessUserResult> {
    try {
      // 1. Validate input
      logger.info("UpdateBusinessUserUseCase", "system", "Validating input data");
      const validatedData = updateBusinessUserSchema.parse(input);

      logger.info(
        "UpdateBusinessUserUseCase",
        "system",
        `Updating BusinessUser ${validatedData.id} with role ${validatedData.role}`
      );

      // 2. Find existing relationship
      const existingBusinessUser = await this.businessUserRepository.findById(
        validatedData.id
      );

      if (!existingBusinessUser) {
        logger.error(
          "UpdateBusinessUserUseCase",
          "system",
          `BusinessUser with ID ${validatedData.id} not found`
        );
        return {
          success: false,
          error: "Business-user relationship not found",
        };
      }

      // 3. Update domain entity
      logger.info(
        "UpdateBusinessUserUseCase",
        existingBusinessUser.userId,
        `Changing role from ${existingBusinessUser.role} to ${validatedData.role}`
      );

      existingBusinessUser.changeRole(validatedData.role);

      // 4. Persist changes using repository
      logger.info(
        "UpdateBusinessUserUseCase",
        existingBusinessUser.userId,
        "Persisting changes to database"
      );

      const updatedBusinessUser = await this.businessUserRepository.update(
        existingBusinessUser
      );

      logger.info(
        "UpdateBusinessUserUseCase",
        updatedBusinessUser.userId,
        "BusinessUser updated successfully"
      );

      return {
        success: true,
        businessUser: updatedBusinessUser,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => e.message).join(", ");
        logger.error(
          "UpdateBusinessUserUseCase",
          "system",
          `Validation error: ${errorMessage}`
        );
        return {
          success: false,
          error: `Validation error: ${errorMessage}`,
        };
      }

      logger.error(
        "UpdateBusinessUserUseCase",
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
