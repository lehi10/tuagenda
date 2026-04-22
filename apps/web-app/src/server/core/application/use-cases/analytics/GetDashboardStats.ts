import {
  IAnalyticsRepository,
  DashboardStats,
} from "@/server/core/domain/repositories/IAnalyticsRepository";

interface GetDashboardStatsInput {
  businessId: string;
  startDate: Date;
  endDate: Date;
  prevStartDate: Date;
  prevEndDate: Date;
}

export interface GetDashboardStatsResult {
  success: boolean;
  data?: DashboardStats;
  error?: string;
}

export class GetDashboardStatsUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(
    input: GetDashboardStatsInput
  ): Promise<GetDashboardStatsResult> {
    try {
      const data = await this.analyticsRepository.getDashboardStats(input);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
