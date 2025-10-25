"use client";

import { Calendar, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { useTranslation } from "@/i18n";

export function CalendarStats() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t.pages.calendar.today,
      value: "12",
      icon: Calendar,
      description: "Appointments today",
    },
    {
      title: t.pages.appointments.upcoming,
      value: "8",
      icon: Clock,
      description: "Next 7 days",
    },
    {
      title: t.pages.payments.completed,
      value: "45",
      icon: CheckCircle,
      description: "This month",
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
