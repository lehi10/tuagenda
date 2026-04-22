"use client";

import { useState } from "react";
import { useTranslation } from "@/client/i18n";
import {
  AppointmentsCalendar,
  AppointmentDetailModal,
} from "@/client/features/calendar/components";
import { domainAppointmentToUIAppointment } from "@/client/features/calendar/utils/event-adapter";
import type { Appointment } from "@/client/features/calendar/types";
import { useBusiness } from "@/client/contexts/business-context";
import { useTrpc } from "@/client/lib/trpc";

function getInitialDateRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay()); // start of current week
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start: start.toISOString(), end: end.toISOString() };
}

export default function CalendarPage() {
  const { t } = useTranslation();
  const { currentBusiness } = useBusiness();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [dateRange, setDateRange] = useState(getInitialDateRange);

  const { data } = useTrpc.appointment.getBusinessAppointments.useQuery(
    {
      filters: {
        startAfter: dateRange.start,
        startBefore: dateRange.end,
      },
      pagination: { limit: 100, offset: 0 },
    },
    { enabled: !!currentBusiness?.id }
  );

  const appointments = (data?.appointments ?? []).map(
    domainAppointmentToUIAppointment
  );

  const handleDatesChange = (start: Date, end: Date) => {
    setDateRange({ start: start.toISOString(), end: end.toISOString() });
  };

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
      <AppointmentsCalendar
        title={t.pages.calendar.title}
        appointments={appointments}
        onAppointmentClick={setSelectedAppointment}
        onDateRangeSelect={(start, end) => console.log("Selected:", start, end)}
        onDatesChange={handleDatesChange}
      />
      <AppointmentDetailModal
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </div>
  );
}
