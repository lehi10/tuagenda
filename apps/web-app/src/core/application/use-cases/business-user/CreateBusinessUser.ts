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
import { z } from "zod";
import { logger } from "@/lib/logger";

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
 */
export class CreateBusinessUserUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(input: unknown): Promise<CreateBusinessUserResult> {
    try {
      // 1. Validate input
      logger.info(
        "CreateBusinessUserUseCase",
        "system",
        "Validating input data"
      );
      const validatedData = createBusinessUserSchema.parse(input);

      logger.info(
        "CreateBusinessUserUseCase",
        validatedData.userId,
        `Creating relationship for business ${validatedData.businessId} with role ${validatedData.role}`
      );

      // 2. Check if relationship already exists
      const existingRelationship =
        await this.businessUserRepository.findByUserAndBusiness(
          validatedData.userId,
          validatedData.businessId
        );

      if (existingRelationship) {
        logger.info(
          "CreateBusinessUserUseCase",
          validatedData.userId,
          "Relationship already exists"
        );
        return {
          success: false,
          error: "User is already associated with this business",
        };
      }

      // 3. Create domain entity
      logger.info(
        "CreateBusinessUserUseCase",
        validatedData.userId,
        "Creating BusinessUser entity"
      );

      const businessUser = new BusinessUser({
        userId: validatedData.userId,
        businessId: validatedData.businessId,
        role: validatedData.role,
      });

      // 4. Persist using repository
      logger.info(
        "CreateBusinessUserUseCase",
        validatedData.userId,
        "Persisting BusinessUser to database"
      );

      const createdBusinessUser =
        await this.businessUserRepository.create(businessUser);

      logger.info(
        "CreateBusinessUserUseCase",
        validatedData.userId,
        `BusinessUser created successfully with ID: ${createdBusinessUser.id}`
      );

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
