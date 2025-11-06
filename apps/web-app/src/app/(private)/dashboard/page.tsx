"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n";
import { BusinessBanner } from "@/components/business-banner";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentAppointments } from "@/features/dashboard/components/recent-appointments";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { BookingsChart } from "@/features/dashboard/components/bookings-chart";
import { ServicesChart } from "@/features/dashboard/components/services-chart";
import { EmployeePerformance } from "@/features/dashboard/components/employee-performance";
import { ChartsFilter } from "@/features/dashboard/components/charts-filter";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [chartsPeriod, setChartsPeriod] = useState("7days");

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">
          {t.pages.dashboard.title}
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {t.pages.dashboard.welcome}
        </p>
      </div>

      <BusinessBanner />

      <DashboardStats />

      <RecentAppointments />

      <ChartsFilter onFilterChange={setChartsPeriod} />

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart period={chartsPeriod} />
        <BookingsChart period={chartsPeriod} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ServicesChart period={chartsPeriod} />
        <EmployeePerformance period={chartsPeriod} />
      </div>
    </div>
  );
}
