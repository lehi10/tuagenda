"use client";

import { Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

export function ServiceStats() {
  const stats = [
    {
      title: "Total Services",
      value: "24",
      icon: Briefcase,
      description: "Available services",
    },
    {
      title: "Most Popular",
      value: "Haircut",
      icon: TrendingUp,
      description: "120 bookings this month",
    },
    {
      title: "Avg. Price",
      value: "$42",
      icon: DollarSign,
      description: "Across all services",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
