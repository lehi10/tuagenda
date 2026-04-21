"use client";

import { Calendar, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { LucideIcon } from "lucide-react";

function CompactStat({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        <p className="text-lg font-bold leading-none">{value}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function CalendarStats() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t.pages.calendar.today,
      value: "12",
      icon: Calendar,
      description: t.pages.calendar.today,
    },
    {
      title: t.pages.appointments.upcoming,
      value: "8",
      icon: Clock,
      description: t.pages.calendar.next7Days,
    },
    {
      title: t.pages.payments.completed,
      value: "45",
      icon: CheckCircle,
      description: t.pages.calendar.thisMonth,
    },
  ];

  return (
    <div className="grid gap-2 grid-cols-3">
      {stats.map((stat) => (
        <CompactStat key={stat.title} {...stat} />
      ))}
    </div>
  );
}
