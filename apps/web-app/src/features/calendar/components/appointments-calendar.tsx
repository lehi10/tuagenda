"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";
import { FullCalendarView } from "./full-calendar";
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
  title,
  appointments,
  onAppointmentClick,
  onDateRangeSelect,
}: AppointmentsCalendarProps) {
  const [view, setView] = useState<"calendar" | "list">("calendar");
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-1">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendario</span>
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Lista</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <FullCalendarView
          events={events}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          viewType={view}
        />
      </CardContent>
    </Card>
  );
}
