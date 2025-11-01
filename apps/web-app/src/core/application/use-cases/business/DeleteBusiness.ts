import { IBusinessRepository } from "@/core/domain/repositories/IBusinessRepository";
import { z } from "zod";
import { logger } from "@/lib/logger";

const deleteBusinessSchema = z.object({
  id: z.number().int().positive("Business ID must be a positive integer"),
});

export type DeleteBusinessInput = z.infer<typeof deleteBusinessSchema>;

export interface DeleteBusinessResult {
  success: boolean;
  error?: string;
}

export class DeleteBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: unknown): Promise<DeleteBusinessResult> {
    try {
      const validatedData = deleteBusinessSchema.parse(input);
      logger.info(
        "DeleteBusinessUseCase",
        "system",
        `Deleting business with ID: ${validatedData.id}`
      );

      const exists = await this.businessRepository.exists(validatedData.id);

      if (!exists) {
        return { success: false, error: "Business not found" };
      }

      await this.businessRepository.delete(validatedData.id);

      logger.info(
        "DeleteBusinessUseCase",
        "system",
        "Business deleted successfully"
      );
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }
      logger.error(
        "DeleteBusinessUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to delete business" };
    }
  }
}
