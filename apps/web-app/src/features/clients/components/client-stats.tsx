"use client"

import { Users, UserPlus, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"

export function ClientStats() {
  const stats = [
    {
      title: "Total Clients",
      value: "156",
      icon: Users,
      description: "All registered clients",
    },
    {
      title: "New This Month",
      value: "18",
      icon: UserPlus,
      description: "+12% from last month",
    },
    {
      title: "Retention Rate",
      value: "87%",
      icon: TrendingUp,
      description: "Active clients",
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
