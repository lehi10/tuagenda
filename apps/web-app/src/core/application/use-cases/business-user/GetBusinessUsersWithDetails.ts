/**
 * Get Business Users With Details Use Case
 *
 * Retrieves business users with full user information for displaying employee lists.
 * This includes user details like name, email, phone, etc.
 */

import {
  IBusinessUserRepository,
  BusinessUserWithDetails,
} from "@/core/domain/repositories/IBusinessUserRepository";
import { z } from "zod";
import { logger } from "@/lib/logger";

const getBusinessUsersWithDetailsSchema = z.object({
  businessId: z
    .number()
    .int()
    .positive("Business ID must be a positive integer"),
  search: z.string().optional(),
});

export type GetBusinessUsersWithDetailsInput = z.infer<
  typeof getBusinessUsersWithDetailsSchema
>;

export interface GetBusinessUsersWithDetailsResult {
  success: boolean;
  businessUsers?: BusinessUserWithDetails[];
  error?: string;
}

export class GetBusinessUsersWithDetailsUseCase {
  constructor(
    private readonly businessUserRepository: IBusinessUserRepository
  ) {}

  async execute(input: unknown): Promise<GetBusinessUsersWithDetailsResult> {
    try {
      const validatedData = getBusinessUsersWithDetailsSchema.parse(input);

      logger.info(
        "GetBusinessUsersWithDetailsUseCase",
        "system",
        `Fetching business users with details for business ${validatedData.businessId}`
      );

      const businessUsers =
        await this.businessUserRepository.findByBusinessWithUserDetails(
          validatedData.businessId,
          validatedData.search
        );

      logger.info(
        "GetBusinessUsersWithDetailsUseCase",
        "system",
        `Found ${businessUsers.length} business users with details`
      );

      return {
        success: true,
        businessUsers,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }

      logger.error(
        "GetBusinessUsersWithDetailsUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error: "Failed to fetch business users with details",
      };
    }
  }
}
