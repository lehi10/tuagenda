"use client";

import { CardContent } from "@/client/components/ui/card";
import { FullCalendarView } from "./full-calendar";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import type { Appointment } from "../types/appointment";
import { appointmentsToEvents } from "../utils/event-adapter";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import "../styles/calendar.css";

export interface AppointmentsCalendarProps {
  title: string;
  appointments: Appointment[];
  onAppointmentClick?: (_appointment: Appointment) => void;
  onDateRangeSelect?: (_start: Date, _end: Date) => void;
}

export function AppointmentsCalendar({
  appointments,
  onAppointmentClick,
  onDateRangeSelect,
}: AppointmentsCalendarProps) {
  const { timezone } = useBusinessTimezone();
  const events = appointmentsToEvents(appointments);

  const handleEventClick = (eventInfo: EventClickArg) => {
    if (onAppointmentClick) {
      const appointment = appointments.find(
        (apt) => apt.id === eventInfo.event.id
      );
      if (appointment) {
        onAppointmentClick(appointment);
      }
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (onDateRangeSelect) {
      onDateRangeSelect(selectInfo.start, selectInfo.end);
    }
  };

  return (
    <div className="sticky top-[58px] z-[8] rounded-xl border bg-card shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <FullCalendarView
          events={events}
          timezone={timezone}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
        />
      </CardContent>
    </div>
  );
}
