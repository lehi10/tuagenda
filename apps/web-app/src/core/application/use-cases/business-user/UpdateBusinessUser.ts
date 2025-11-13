/**
 * Update BusinessUser Use Case
 *
 * This use case handles updating an existing business-user relationship (mainly the role).
 * It finds the relationship, updates it, and persists changes.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import {
  BusinessUser,
  BusinessRole,
} from "@/core/domain/entities/BusinessUser";
import { logger } from "@/lib/logger";
import { syncUserRole } from "@/lib/auth/authorization";

export interface UpdateBusinessUserInput {
  id: string;
  role: BusinessRole;
}

export interface UpdateBusinessUserResult {
  success: boolean;
  businessUser?: BusinessUser;
  error?: string;
}

/**
 * Update BusinessUser Use Case
 *
 * Business logic for updating a business-user relationship:
 * 1. Find existing relationship
 * 2. Update domain entity
 * 3. Persist changes using repository
 */
export class UpdateBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(
    input: UpdateBusinessUserInput
  ): Promise<UpdateBusinessUserResult> {
    try {
      // 1. Find existing relationship
      const existingBusinessUser = await this.businessUserRepository.findById(
        input.id
      );

      if (!existingBusinessUser) {
        return {
          success: false,
          error: "Business-user relationship not found",
        };
      }

      // 2. Update domain entity
      const oldRole = existingBusinessUser.role;
      existingBusinessUser.changeRole(input.role);

      // 3. Persist changes using repository
      const updatedBusinessUser =
        await this.businessUserRepository.update(existingBusinessUser);

      // 4. Sync role change with authorization service

      const roleSynced = await syncUserRole(
        updatedBusinessUser.userId,
        input.role,
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
