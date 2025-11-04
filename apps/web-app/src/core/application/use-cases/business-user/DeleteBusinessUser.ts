/**
 * Delete BusinessUser Use Case
 *
 * This use case handles deleting a business-user relationship.
 * It validates input, finds the relationship, and deletes it.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { syncUserRole, syncUserType } from "@/lib/auth/authorization";

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
 * 4. Check if user still has other businesses
 * 5. If no businesses remain, demote user from admin to customer
 */
export class DeleteBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: unknown): Promise<DeleteBusinessUserResult> {
    try {
      // 1. Validate input
      const validatedData = deleteBusinessUserSchema.parse(input);

      // 2. Check if relationship exists
      const existingBusinessUser = await this.businessUserRepository.findById(
        validatedData.id
      );

      if (!existingBusinessUser) {
        return {
          success: false,
          error: "Business-user relationship not found",
        };
      }

      // 3. Delete using repository

      const userId = existingBusinessUser.userId;
      const businessId = existingBusinessUser.businessId;
      const role = existingBusinessUser.role;

      await this.businessUserRepository.delete(validatedData.id);

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

      // 4. Check if user still has other businesses

      const remainingBusinesses =
        await this.businessUserRepository.findByUser(userId);

      // 5. If no businesses remain, demote user from admin to customer
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
