/**
 * Create BusinessUser Server Action
 *
 * This server action handles creating a new business-user relationship.
 * It uses hexagonal architecture with use cases.
 *
 * @module actions/business-user
 */

"use server";

import { z } from "zod";
import { BusinessUserProps, BusinessRole } from "@/core/domain/entities";
import {
  CreateBusinessUserUseCase,
  CreateBusinessUserInput,
} from "@/core/application/use-cases/business-user";
import {
  PrismaBusinessUserRepository,
  PrismaUserRepository,
} from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const createBusinessUserSchema = z.object({
  businessId: z.number(),
  role: z.nativeEnum(BusinessRole),
});

export type CreateBusinessUserActionInput = z.infer<
  typeof createBusinessUserSchema
>;

type CreateBusinessUserResult =
  | { success: true; businessUser: BusinessUserProps }
  | { success: false; error: string };

/**
 * Creates a new business-user relationship
 *
 * @param input - Business-user relationship data
 * @returns Result object with success status and business-user data or error message
 */
export async function createBusinessUser(
  input: unknown
): Promise<CreateBusinessUserResult> {
  return validatePrivateAction(
    createBusinessUserSchema,
    input,
    async (validated, userId) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const userRepository = new PrismaUserRepository();
      const createBusinessUserUseCase = new CreateBusinessUserUseCase(
        businessUserRepository,
        userRepository
      );

      const data: CreateBusinessUserInput = {
        userId,
        businessId: validated.businessId,
        role: validated.role,
      };

      const result = await createBusinessUserUseCase.execute(data);

      if (result.success && result.businessUser) {
        return {
          success: true,
          businessUser: result.businessUser.toObject(),
        };
      }

      return {
        success: false,
        error: result.error || "Failed to create business-user relationship",
      };
    },
    {
      errorMessage: "An unexpected error occurred while creating business-user",
    }
  );
}
