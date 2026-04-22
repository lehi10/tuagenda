import {
  IAnalyticsRepository,
  DashboardCharts,
} from "@/server/core/domain/repositories/IAnalyticsRepository";

interface GetDashboardChartsInput {
  businessId: string;
  startDate: Date;
  endDate: Date;
  prevStartDate: Date;
  prevEndDate: Date;
}

export interface GetDashboardChartsResult {
  success: boolean;
  data?: DashboardCharts;
  error?: string;
}

export class GetDashboardChartsUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(
    input: GetDashboardChartsInput
  ): Promise<GetDashboardChartsResult> {
    try {
      const data = await this.analyticsRepository.getDashboardCharts(input);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
