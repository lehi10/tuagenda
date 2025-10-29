"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n";
import { CalendarStats } from "@/features/calendar/components/calendar-stats";
import {
  AppointmentsCalendar,
  AppointmentDetailModal,
} from "@/features/calendar/components";
import { mockAppointments } from "@/features/calendar/data/mock-appointments";
import type { Appointment } from "@/features/calendar/types";

export default function CalendarPage() {
  const { t } = useTranslation();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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
