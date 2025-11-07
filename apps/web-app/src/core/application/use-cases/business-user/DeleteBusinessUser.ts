/**
 * Delete BusinessUser Use Case
 *
 * This use case handles deleting a business-user relationship.
 * It finds the relationship, deletes it, and handles user type demotion if needed.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { logger } from "@/lib/logger";
import { syncUserRole, syncUserType } from "@/lib/auth/authorization";

export interface DeleteBusinessUserInput {
  id: number;
}

export interface DeleteBusinessUserResult {
  success: boolean;
  error?: string;
}

/**
 * Delete BusinessUser Use Case
 *
 * Business logic for deleting a business-user relationship:
 * 1. Check if relationship exists
 * 2. Delete using repository
 * 3. Check if user still has other businesses
 * 4. If no businesses remain, demote user from admin to customer
 */
export class DeleteBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    input: DeleteBusinessUserInput
  ): Promise<DeleteBusinessUserResult> {
    try {
      // 1. Check if relationship exists
      const existingBusinessUser = await this.businessUserRepository.findById(
        input.id
      );

      if (!existingBusinessUser) {
        return {
          success: false,
          error: "Business-user relationship not found",
        };
      }

      // 2. Delete using repository

      const userId = existingBusinessUser.userId;
      const businessId = existingBusinessUser.businessId;
      const role = existingBusinessUser.role;

      await this.businessUserRepository.delete(input.id);

      // Sync role removal with authorization service
      const roleRemoved = await syncUserRole(
        userId,
        role,
        businessId.toString(),
        "remove"
      );

      if (!roleRemoved) {
        logger.error(
          "DeleteBusinessUserUseCase",
          userId,
          "Failed to remove role from authorization service"
        );
        // Continue anyway - the database was updated
      }

      // 3. Check if user still has other businesses

      const remainingBusinesses =
        await this.businessUserRepository.findByUser(userId);

      // 4. If no businesses remain, demote user from admin to customer
      if (remainingBusinesses.length === 0) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
          logger.error(
            "DeleteBusinessUserUseCase",
            userId,
            "User not found after deleting business relationship"
          );
          // Relationship was deleted but user not found - this is an inconsistency
          // We still return success for the deletion
        } else if (user.isAdmin() && !user.isSuperAdmin()) {
          user.demoteToCustomer();
          await this.userRepository.update(user);

          // Sync user type removal with authorization service
          await syncUserType(userId, "admin", "remove");
          await syncUserType(userId, "customer", "add");
        }
      }

      return {
        success: true,
      };
    } catch (error) {
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
