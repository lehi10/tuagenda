"use client";

import { useState } from "react";
import { useTranslation } from "@/client/i18n";
import { BusinessBanner } from "@/client/components/business-banner";
import { DashboardStats } from "@/client/features/dashboard/components/dashboard-stats";
import { RecentAppointments } from "@/client/features/dashboard/components/recent-appointments";
import { RevenueChart } from "@/client/features/dashboard/components/revenue-chart";
import { BookingsChart } from "@/client/features/dashboard/components/bookings-chart";
import { ServicesChart } from "@/client/features/dashboard/components/services-chart";
import { EmployeePerformance } from "@/client/features/dashboard/components/employee-performance";
import { ChartsFilter } from "@/client/features/dashboard/components/charts-filter";
import { useBusiness } from "@/client/contexts/business-context";
import { useTrpc } from "@/client/lib/trpc";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [chartsPeriod, setChartsPeriod] = useState("7days");
  const { currentBusiness } = useBusiness();

  const businessId = currentBusiness?.id ?? "";

  const { data: chartsData, isLoading: chartsLoading } =
    useTrpc.analytics.getCharts.useQuery(
      {
        businessId,
        period: chartsPeriod as "7days" | "30days" | "3months" | "6months" | "year",
      },
      { enabled: !!businessId }
    );

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Header + business info */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-lg font-bold">{t.pages.dashboard.title}</h1>
          <BusinessBanner />
        </div>
        <p className="text-xs text-muted-foreground">{t.pages.dashboard.welcome}</p>
      </div>

      {/* KPI strip */}
      <DashboardStats businessId={businessId} period={chartsPeriod} />

      {/* Recent appointments */}
      <RecentAppointments />

      {/* Analytics charts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Analytics
          </span>
          <ChartsFilter onFilterChange={setChartsPeriod} />
        </div>

        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          <RevenueChart data={chartsData?.revenue ?? []} isLoading={chartsLoading} />
          <BookingsChart data={chartsData?.bookings ?? []} isLoading={chartsLoading} />
          <ServicesChart data={chartsData?.services ?? []} isLoading={chartsLoading} />
          <EmployeePerformance data={chartsData?.employees ?? []} isLoading={chartsLoading} />
        </div>
      </div>
    </div>
  );
}
