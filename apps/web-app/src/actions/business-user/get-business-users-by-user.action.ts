/**
 * Get BusinessUsers By User Server Action
 *
 * This server action handles retrieving all businesses associated with a user.
 *
 * REFACTORED: Uses hexagonal architecture with use cases.
 * Validation happens here, use case receives validated data.
 * Uses action-validator wrapper for consistent error handling.
 *
 * @module actions/business-user
 */

"use server";

import { z } from "zod";
import { BusinessUserProps, BusinessRole } from "@/core/domain/entities";
import { GetBusinessUsersByUserUseCase } from "@/core/application/use-cases/business-user";
import { PrismaBusinessUserRepository } from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation
const getBusinessUsersByUserSchema = z.object({
  role: z.nativeEnum(BusinessRole).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type GetBusinessUsersByUserInput = z.infer<
  typeof getBusinessUsersByUserSchema
>;

type GetBusinessUsersByUserResult =
  | { success: true; businessUsers: BusinessUserProps[] }
  | { success: false; error: string };

/**
 * Gets all businesses associated with the authenticated user
 *
 * @param input - Query parameters (optional filters)
 * @returns Result object with success status and business-user list or error message
 */
export async function getBusinessUsersByUser(
  input: unknown
): Promise<GetBusinessUsersByUserResult> {
  return validatePrivateAction(
    getBusinessUsersByUserSchema,
    input,
    async (validated, userId) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersByUserUseCase = new GetBusinessUsersByUserUseCase(
        businessUserRepository
      );

      const result = await getBusinessUsersByUserUseCase.execute({
        userId,
        ...validated,
      });

      if (result.success && result.businessUsers) {
        return {
          success: true,
          businessUsers: result.businessUsers.map((bu) => bu.toObject()),
        };
      }

      return {
        success: false,
        error: result.error || "Failed to get user businesses",
      };
    },
    {
      errorMessage:
        "An unexpected error occurred while fetching user businesses",
    }
  );
}
