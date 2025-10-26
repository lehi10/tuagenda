"use client";

import { useTranslation } from "@/i18n";
import { OrganizationBanner } from "@/components/organization-banner";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentAppointments } from "@/features/dashboard/components/recent-appointments";

export default function DashboardPage() {
  const { t } = useTranslation();

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
      <OrganizationBanner />
      <DashboardStats />
      <RecentAppointments />
    </div>
  );
}
