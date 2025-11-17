/**
 * Create BusinessUser Use Case
 *
 * This use case handles the creation of a new business-user relationship.
 * It checks for existing relationships, creates the domain entity,
 * and persists it using the repository.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/server/core/domain/repositories/IBusinessUserRepository";
import {
  BusinessUser,
  BusinessRole,
} from "@/server/core/domain/entities/BusinessUser";
import { IUserRepository } from "@/server/core/domain/repositories/IUserRepository";
import { logger } from "@/server/lib/logger";
import { syncUserRole, syncUserType } from "@/server/lib/auth/authorization";

export interface CreateBusinessUserInput {
  userId: string;
  businessId: string;
  role: BusinessRole;
}

export interface CreateBusinessUserResult {
  success: boolean;
  businessUser?: BusinessUser;
  error?: string;
}

/**
 * Create BusinessUser Use Case
 *
 * Business logic for creating a new business-user relationship:
 * 1. Check if relationship already exists
 * 2. Create domain entity
 * 3. Persist using repository
 * 4. Promote user to admin if not already
 */
export class CreateBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    input: CreateBusinessUserInput
  ): Promise<CreateBusinessUserResult> {
    try {
      // 1. Check if relationship already exists
      const existingRelationship =
        await this.businessUserRepository.findByUserAndBusiness(
          input.userId,
          input.businessId
        );

      if (existingRelationship) {
        return {
          success: false,
          error: "User is already associated with this business",
        };
      }

      // 2. Create domain entity
      const businessUser = new BusinessUser({
        userId: input.userId,
        businessId: input.businessId,
        role: input.role,
      });

      // 3. Persist using repository
      const createdBusinessUser =
        await this.businessUserRepository.create(businessUser);

      // 4. Sync role with Casbin authorization service
      const roleSynced = await syncUserRole(
        input.userId,
        input.role,
        input.businessId.toString(),
        "add"
      );

      if (!roleSynced) {
        logger.error(
          "CreateBusinessUserUseCase",
          input.userId,
          "Failed to sync role with authorization service"
        );
        // Continue anyway - the business relationship was created
      }

      // 5. Promote user to admin if not already

      const user = await this.userRepository.findById(input.userId);

      if (!user) {
        logger.error(
          "CreateBusinessUserUseCase",
          input.userId,
          "User not found after creating business relationship"
        );
        // Relationship was created but user not found - this is an inconsistency
        // We still return success for the business relationship creation
      } else if (!user.isAdmin()) {
        user.promoteToAdmin();
        await this.userRepository.update(user);

        // Sync admin type with authorization service
        await syncUserType(input.userId, "admin", "add");
      }

      return {
        success: true,
        businessUser: createdBusinessUser,
      };
    } catch (error) {
      logger.error(
        "CreateBusinessUserUseCase",
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
