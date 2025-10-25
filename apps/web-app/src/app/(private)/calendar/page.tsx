"use client"

import { useState } from "react"
import { useTranslation } from "@/i18n"
import { CalendarStats } from "@/features/calendar/components/calendar-stats"
import { CalendarView } from "@/features/calendar/components/calendar-view"
import { DayAppointments } from "@/features/calendar/components/day-appointments"

export default function CalendarPage() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.pages.calendar.title}</h1>
        <p className="text-sm text-muted-foreground">
          Manage your appointments and schedule
        </p>
      </div>
      <CalendarStats />
      <div className="grid gap-6 md:grid-cols-2">
        <CalendarView onDateSelect={setSelectedDate} />
        <DayAppointments date={selectedDate} />
      </div>
    </div>
  )
}
