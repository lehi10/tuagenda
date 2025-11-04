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

      const userId = existingBusinessUser.userId;
      await this.businessUserRepository.delete(validatedData.id);

      logger.info(
        "DeleteBusinessUserUseCase",
        userId,
        "BusinessUser deleted successfully"
      );

      // 4. Check if user still has other businesses
      logger.info(
        "DeleteBusinessUserUseCase",
        userId,
        "Checking if user has other business relationships"
      );

      const remainingBusinesses =
        await this.businessUserRepository.findByUser(userId);

      logger.info(
        "DeleteBusinessUserUseCase",
        userId,
        `User has ${remainingBusinesses.length} remaining business relationship(s)`
      );

      // 5. If no businesses remain, demote user from admin to customer
      if (remainingBusinesses.length === 0) {
        logger.info(
          "DeleteBusinessUserUseCase",
          userId,
          "No remaining businesses, checking if user should be demoted"
        );

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
          logger.info(
            "DeleteBusinessUserUseCase",
            userId,
            `Demoting user from ${user.type} to customer`
          );
          user.demoteToCustomer();
          await this.userRepository.update(user);

          logger.info(
            "DeleteBusinessUserUseCase",
            userId,
            "User successfully demoted to customer"
          );
        } else if (user.isSuperAdmin()) {
          logger.info(
            "DeleteBusinessUserUseCase",
            userId,
            "User is superadmin, no demotion performed"
          );
        } else {
          logger.info(
            "DeleteBusinessUserUseCase",
            userId,
            "User is not admin, no demotion needed"
          );
        }
      } else {
        logger.info(
          "DeleteBusinessUserUseCase",
          userId,
          "User still has other businesses, maintaining admin status"
        );
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
