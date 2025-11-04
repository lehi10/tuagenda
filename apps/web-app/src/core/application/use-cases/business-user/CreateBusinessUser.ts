/**
 * Create BusinessUser Use Case
 *
 * This use case handles the creation of a new business-user relationship.
 * It validates input, checks for existing relationships, creates the domain entity,
 * and persists it using the repository.
 *
 * @module core/application/use-cases/business-user
 */

import { IBusinessUserRepository } from "@/core/domain/repositories/IBusinessUserRepository";
import {
  BusinessUser,
  BusinessRole,
} from "@/core/domain/entities/BusinessUser";
import { IUserRepository } from "@/core/domain/repositories/IUserRepository";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { syncUserRole, syncUserType } from "@/lib/auth/authorization";

/**
 * Input schema for creating a business-user relationship
 */
const createBusinessUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  businessId: z
    .number()
    .int()
    .positive("Business ID must be a positive integer"),
  role: z.enum([BusinessRole.MANAGER, BusinessRole.EMPLOYEE], {
    message: "Invalid role",
  }),
});

export type CreateBusinessUserInput = z.infer<typeof createBusinessUserSchema>;

export interface CreateBusinessUserResult {
  success: boolean;
  businessUser?: BusinessUser;
  error?: string;
}

/**
 * Create BusinessUser Use Case
 *
 * Business logic for creating a new business-user relationship:
 * 1. Validate input data
 * 2. Check if relationship already exists
 * 3. Create domain entity
 * 4. Persist using repository
 * 5. Promote user to admin if not already
 */
export class CreateBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: unknown): Promise<CreateBusinessUserResult> {
    try {
      // 1. Validate input
      const validatedData = createBusinessUserSchema.parse(input);

      // 2. Check if relationship already exists
      const existingRelationship =
        await this.businessUserRepository.findByUserAndBusiness(
          validatedData.userId,
          validatedData.businessId
        );

      if (existingRelationship) {
        return {
          success: false,
          error: "User is already associated with this business",
        };
      }

      // 3. Create domain entity
      const businessUser = new BusinessUser({
        userId: validatedData.userId,
        businessId: validatedData.businessId,
        role: validatedData.role,
      });

      // 4. Persist using repository
      const createdBusinessUser =
        await this.businessUserRepository.create(businessUser);

      // 5. Sync role with Casbin authorization service
      const roleSynced = await syncUserRole(
        validatedData.userId,
        validatedData.role,
        validatedData.businessId.toString(),
        "add"
      );

      if (!roleSynced) {
        logger.error(
          "CreateBusinessUserUseCase",
          validatedData.userId,
          "Failed to sync role with authorization service"
        );
        // Continue anyway - the business relationship was created
      }

      // 6. Promote user to admin if not already

      const user = await this.userRepository.findById(validatedData.userId);

      if (!user) {
        logger.error(
          "CreateBusinessUserUseCase",
          validatedData.userId,
          "User not found after creating business relationship"
        );
        // Relationship was created but user not found - this is an inconsistency
        // We still return success for the business relationship creation
      } else if (!user.isAdmin()) {
        user.promoteToAdmin();
        await this.userRepository.update(user);

        // Sync admin type with authorization service
        await syncUserType(validatedData.userId, "admin", "add");
      }

      return {
        success: true,
        businessUser: createdBusinessUser,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map((e) => e.message).join(", ");
        logger.error(
          "CreateBusinessUserUseCase",
          "system",
          `Validation error: ${errorMessage}`
        );
        return {
          success: false,
          error: `Validation error: ${errorMessage}`,
        };
      }

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
