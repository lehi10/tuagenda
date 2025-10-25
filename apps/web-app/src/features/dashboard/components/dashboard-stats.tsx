"use client"

import { Calendar, Clock, DollarSign, Users } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { useTranslation } from "@/i18n"

export function DashboardStats() {
  const { t } = useTranslation()

  const stats = [
    {
      title: t.pages.appointments.title,
      value: "24",
      icon: Calendar,
      description: "+12% from last month",
    },
    {
      title: t.pages.appointments.upcoming,
      value: "8",
      icon: Clock,
      description: "Next 7 days",
    },
    {
      title: t.pages.clients.title,
      value: "156",
      icon: Users,
      description: "+18 new this month",
    },
    {
      title: "Revenue",
      value: "$2,450",
      icon: DollarSign,
      description: "+20% from last month",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
