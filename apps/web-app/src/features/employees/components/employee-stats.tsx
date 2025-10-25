"use client"

import { Users, UserCheck, Calendar } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { useTranslation } from "@/i18n"

export function EmployeeStats() {
  const { t } = useTranslation()

  const stats = [
    {
      title: "Total Employees",
      value: "12",
      icon: Users,
      description: "All team members",
    },
    {
      title: "Active Today",
      value: "8",
      icon: UserCheck,
      description: "Working now",
    },
    {
      title: "Appointments Today",
      value: "45",
      icon: Calendar,
      description: "Across all employees",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
