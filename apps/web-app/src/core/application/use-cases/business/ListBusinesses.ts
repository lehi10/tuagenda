import { IBusinessRepository } from "@/core/domain/repositories/IBusinessRepository";
import { Business, BusinessStatus } from "@/core/domain/entities/Business";
import { z } from "zod";
import { logger } from "@/lib/logger";

const listBusinessesSchema = z.object({
  status: z.nativeEnum(BusinessStatus).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

export type ListBusinessesInput = z.infer<typeof listBusinessesSchema>;

export interface ListBusinessesResult {
  success: boolean;
  businesses?: Business[];
  total?: number;
  error?: string;
}

export class ListBusinessesUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(input: unknown = {}): Promise<ListBusinessesResult> {
    try {
      const validatedData = listBusinessesSchema.parse(input);
      logger.info(
        "ListBusinessesUseCase",
        "system",
        "Fetching businesses list"
      );

      const businesses = await this.businessRepository.findAll(validatedData);
      const total = await this.businessRepository.count(validatedData);

      logger.info(
        "ListBusinessesUseCase",
        "system",
        `Found ${businesses.length} businesses (total: ${total})`
      );
      return { success: true, businesses, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }
      logger.error(
        "ListBusinessesUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      return { success: false, error: "Failed to fetch businesses" };
    }
  }
}
