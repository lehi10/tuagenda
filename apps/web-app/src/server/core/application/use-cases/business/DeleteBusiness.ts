import { IBusinessRepository } from "@/server/core/domain/repositories/IBusinessRepository";
import { logger } from "@/server/lib/logger";

export interface DeleteBusinessInput {
  id: string;
}

export interface DeleteBusinessResult {
  success: boolean;
  error?: string;
}

export class DeleteBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: DeleteBusinessInput): Promise<DeleteBusinessResult> {
    try {
      logger.info(
        "DeleteBusinessUseCase",
        "system",
        `Deleting business with ID: ${input.id}`
      );

      const exists = await this.businessRepository.exists(input.id);

      if (!exists) {
        return { success: false, error: "Business not found" };
      }

      await this.businessRepository.delete(input.id);

      logger.info(
        "DeleteBusinessUseCase",
        "system",
        "Business deleted successfully"
      );
      return { success: true };
    } catch (error) {
      logger.error(
        "DeleteBusinessUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to delete business" };
    }
  }
}
