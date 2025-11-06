"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { CalendarEvent } from "../types/appointment";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";

export interface FullCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (_eventInfo: EventClickArg) => void;
  onDateSelect?: (_selectInfo: DateSelectArg) => void;
  viewType?: "calendar" | "list";
}

export function FullCalendarView({
  events,
  onEventClick,
  onDateSelect,
  viewType = "calendar",
}: FullCalendarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const calendarView = viewType === "list" ? "listWeek" : "dayGridMonth";

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      key={viewType}
      events={events}
      eventClick={onEventClick}
      select={onDateSelect}
      selectable={viewType === "calendar"}
      headerToolbar={
        viewType === "list"
          ? {
              left: "prev,next",
              center: "title",
              right: "today",
            }
          : isMobile
            ? {
                left: "prev,next",
                center: "title",
                right: "today",
              }
            : {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }
      }
      moreLinkText={(num) => `+${num} más`}
      height="auto"
      contentHeight="auto"
      eventDisplay="block"
      displayEventTime={true}
      displayEventEnd={false}
      dayHeaderFormat={isMobile ? { weekday: "narrow" } : { weekday: "short" }}
      listDayFormat={{ month: "long", day: "numeric", year: "numeric" }}
      listDaySideFormat={false}
      noEventsContent="No hay citas programadas"
      eventTimeFormat={{
        hour: "2-digit",
        minute: "2-digit",
        meridiem: false,
        hour12: false,
      }}
      initialView={isMobile ? "listWeek" : "dayGridMonth"}
      dayMaxEvents={isMobile ? 2 : 3}
      eventContent={(eventInfo) => (
        <div
          style={{
            fontSize: "0.8rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <strong>{eventInfo.timeText}</strong>
          {eventInfo.event.title}
        </div>
      )}
    />
  );
}
