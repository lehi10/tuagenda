import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { businessMemberProcedure } from "../procedures";
import { PrismaAnalyticsRepository } from "@/server/infrastructure/repositories/PrismaAnalyticsRepository";
import { GetDashboardStatsUseCase } from "@/server/core/application/use-cases/analytics/GetDashboardStats";
import { GetDashboardChartsUseCase } from "@/server/core/application/use-cases/analytics/GetDashboardCharts";
import { AnalyticsPeriod } from "@/server/core/domain/repositories/IAnalyticsRepository";

const periodEnum = z.enum(["7days", "30days", "3months", "6months", "year"]);

const analyticsInput = z.object({
  period: periodEnum.default("30days"),
});

function periodToDateRange(period: AnalyticsPeriod): {
  startDate: Date;
  endDate: Date;
  prevStartDate: Date;
  prevEndDate: Date;
} {
  const days: Record<AnalyticsPeriod, number> = {
    "7days": 7,
    "30days": 30,
    "3months": 90,
    "6months": 180,
    year: 365,
  };

  const periodDays = days[period];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - periodDays * 86400000);
  const prevEndDate = new Date(startDate);
  const prevStartDate = new Date(startDate.getTime() - periodDays * 86400000);

  return { startDate, endDate, prevStartDate, prevEndDate };
}

export const analyticsRouter = router({
  /**
   * Dashboard KPI stats
   * Returns totals and previous-period comparisons for the 4 stat cards
   */
  getStats: businessMemberProcedure
    .input(analyticsInput)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, prevStartDate, prevEndDate } =
        periodToDateRange(input.period as AnalyticsPeriod);

      const analyticsRepository = new PrismaAnalyticsRepository();
      const useCase = new GetDashboardStatsUseCase(analyticsRepository);

      const result = await useCase.execute({
        businessId: ctx.businessId,
        startDate,
        endDate,
        prevStartDate,
        prevEndDate,
      });

      if (!result.success || !result.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error ?? "Failed to fetch dashboard stats",
        });
      }

      return result.data;
    }),

  /**
   * Dashboard chart data
   * Returns revenue, bookings, services, and employee performance data
   */
  getCharts: businessMemberProcedure
    .input(analyticsInput)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, prevStartDate, prevEndDate } =
        periodToDateRange(input.period as AnalyticsPeriod);

      const analyticsRepository = new PrismaAnalyticsRepository();
      const useCase = new GetDashboardChartsUseCase(analyticsRepository);

      const result = await useCase.execute({
        businessId: ctx.businessId,
        startDate,
        endDate,
        prevStartDate,
        prevEndDate,
      });

      if (!result.success || !result.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error ?? "Failed to fetch dashboard charts",
        });
      }

      return result.data;
    }),
});
