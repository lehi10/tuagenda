import { IBusinessRepository } from "@/core/domain/repositories/IBusinessRepository";
import { Business } from "@/core/domain/entities/Business";
import { z } from "zod";
import { logger } from "@/lib/logger";

const getBusinessSchema = z.object({
  id: z.number().int().positive("Business ID must be a positive integer"),
});

export type GetBusinessInput = z.infer<typeof getBusinessSchema>;

export interface GetBusinessResult {
  success: boolean;
  business?: Business;
  error?: string;
}

export class GetBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: unknown): Promise<GetBusinessResult> {
    try {
      const validatedData = getBusinessSchema.parse(input);
      logger.info(
        "GetBusinessUseCase",
        "system",
        `Fetching business with ID: ${validatedData.id}`
      );

      const business = await this.businessRepository.findById(validatedData.id);

      if (!business) {
        logger.info("GetBusinessUseCase", "system", "Business not found");
        return { success: false, error: "Business not found" };
      }

      logger.info(
        "GetBusinessUseCase",
        "system",
        "Business retrieved successfully"
      );
      return { success: true, business };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }
      logger.error(
        "GetBusinessUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to fetch business" };
    }
  }
}
