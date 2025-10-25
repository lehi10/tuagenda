"use client"

import { DollarSign, TrendingUp, CreditCard, Clock } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"

export function PaymentStats() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      icon: DollarSign,
      description: "This month",
    },
    {
      title: "Growth",
      value: "+20%",
      icon: TrendingUp,
      description: "vs last month",
    },
    {
      title: "Completed",
      value: "245",
      icon: CreditCard,
      description: "Successful payments",
    },
    {
      title: "Pending",
      value: "8",
      icon: Clock,
      description: "Awaiting payment",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
