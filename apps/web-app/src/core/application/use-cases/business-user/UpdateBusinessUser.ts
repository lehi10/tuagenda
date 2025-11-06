/**
 * Update BusinessUser Use Case
 *
 * This use case handles updating an existing business-user relationship (mainly the role).
 * It validates input, finds the relationship, updates it, and persists changes.
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
import { syncUserRole } from "@/lib/auth/authorization";

/**
 * Input schema for updating a business-user relationship
 */
const updateBusinessUserSchema = z.object({
  id: z.number().int().positive("BusinessUser ID must be a positive integer"),
  role: z.enum([BusinessRole.MANAGER, BusinessRole.EMPLOYEE], {
    message: "Invalid role",
  }),
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
      const validatedData = updateBusinessUserSchema.parse(input);

      // 2. Find existing relationship
      const existingBusinessUser = await this.businessUserRepository.findById(
        validatedData.id
      );

      if (!existingBusinessUser) {
        return {
          success: false,
          error: "Business-user relationship not found",
        };
      }

      // 3. Update domain entity
      const oldRole = existingBusinessUser.role;
      existingBusinessUser.changeRole(validatedData.role);

      // 4. Persist changes using repository
      const updatedBusinessUser =
        await this.businessUserRepository.update(existingBusinessUser);

      // 5. Sync role change with authorization service

      const roleSynced = await syncUserRole(
        updatedBusinessUser.userId,
        validatedData.role,
        updatedBusinessUser.businessId.toString(),
        "update",
        oldRole
      );

      if (!roleSynced) {
        logger.error(
          "UpdateBusinessUserUseCase",
          updatedBusinessUser.userId,
          "Failed to sync role change with authorization service"
        );
        // Continue anyway - the database was updated
      }

      return {
        success: true,
        businessUser: updatedBusinessUser,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map((e) => e.message).join(", ");
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
