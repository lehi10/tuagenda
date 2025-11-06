"use client";

import { MapPin, Users, Building } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

export function LocationStats() {
  const stats = [
    {
      title: "Total Locations",
      value: "3",
      icon: Building,
      description: "Active branches",
    },
    {
      title: "Total Employees",
      value: "18",
      icon: Users,
      description: "Across all locations",
    },
    {
      title: "Coverage Area",
      value: "NYC",
      icon: MapPin,
      description: "3 districts",
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
