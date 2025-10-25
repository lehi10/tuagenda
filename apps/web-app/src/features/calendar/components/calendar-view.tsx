"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/i18n"

interface CalendarViewProps {
  onDateSelect?: (date: Date | undefined) => void
}

export function CalendarView({ onDateSelect }: CalendarViewProps) {
  const { t } = useTranslation()
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onDateSelect?.(newDate)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.pages.calendar.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  )
}
