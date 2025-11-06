"use client";

import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { useTranslation } from "@/i18n";

export function AppointmentStats() {
  const { t } = useTranslation();

  const stats = [
    {
      title: "Total",
      value: "156",
      icon: Calendar,
      description: "All appointments",
    },
    {
      title: t.pages.appointments.upcoming,
      value: "24",
      icon: Clock,
      description: "Next 30 days",
    },
    {
      title: t.pages.payments.completed,
      value: "120",
      icon: CheckCircle,
      description: "This month",
    },
    {
      title: "Cancelled",
      value: "12",
      icon: XCircle,
      description: "This month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
