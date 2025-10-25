"use client"

import { useTranslation } from "@/i18n"
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats"
import { RecentAppointments } from "@/features/dashboard/components/recent-appointments"

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.pages.dashboard.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.pages.dashboard.welcome}
        </p>
      </div>
      <DashboardStats />
      <RecentAppointments />
    </div>
  )
}
