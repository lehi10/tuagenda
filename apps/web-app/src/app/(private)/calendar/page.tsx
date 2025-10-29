"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n";
import { CalendarStats } from "@/features/calendar/components/calendar-stats";
import { CalendarView } from "@/features/calendar/components/calendar-view";
import { DayAppointments } from "@/features/calendar/components/day-appointments";

export default function CalendarPage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">
          {t.pages.calendar.title}
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Manage your appointments and schedule
        </p>
      </div>
      <CalendarStats />
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <CalendarView onDateSelect={setSelectedDate} />
        <DayAppointments date={selectedDate} />
      </div>
    </div>
  );
}
