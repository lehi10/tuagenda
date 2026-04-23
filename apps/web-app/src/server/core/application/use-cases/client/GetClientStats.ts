import {
  IClientRepository,
  ClientStats,
} from "@/server/core/domain/repositories/IClientRepository";

export interface GetClientStatsInput {
  businessId: string;
}

export interface GetClientStatsResult {
  success: boolean;
  stats?: ClientStats;
  error?: string;
}

export class GetClientStatsUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(input: GetClientStatsInput): Promise<GetClientStatsResult> {
    try {
      const stats = await this.clientRepository.getStats(input.businessId);
      return { success: true, stats };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch client stats",
      };
    }
  }
}
