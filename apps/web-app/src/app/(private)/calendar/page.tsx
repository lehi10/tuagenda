"use client";

import { useState } from "react";
import { useTranslation } from "@/client/i18n";
import { CalendarStats } from "@/client/features/calendar/components/calendar-stats";
import {
  AppointmentsCalendar,
  AppointmentDetailModal,
} from "@/client/features/calendar/components";
import { mockAppointments } from "@/client/features/calendar/data/mock-appointments";
import type { Appointment } from "@/client/features/calendar/types";

export default function CalendarPage() {
  const { t } = useTranslation();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  return (
    <div className="p-4 space-y-3 sm:p-6 sm:space-y-4">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">
          {t.pages.calendar.title}
        </h1>
        <p className="text-xs text-muted-foreground">
          {t.pages.calendar.subtitle}
        </p>
      </div>
      <CalendarStats />
      <AppointmentsCalendar
        title={t.pages.calendar.title}
        appointments={mockAppointments}
        onAppointmentClick={setSelectedAppointment}
        onDateRangeSelect={(start, end) => console.log("Selected:", start, end)}
      />
      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </div>
  );
}
