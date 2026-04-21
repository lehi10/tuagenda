"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import luxonPlugin from "@fullcalendar/luxon3";
import type { CalendarEvent } from "../types/appointment";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import allLocales from "@fullcalendar/core/locales-all";
import { useTranslation } from "@/client/i18n";

export interface FullCalendarProps {
  events: CalendarEvent[];
  timezone?: string;
  onEventClick?: (_eventInfo: EventClickArg) => void;
  onDateSelect?: (_selectInfo: DateSelectArg) => void;
  onDatesSet?: (_start: Date, _end: Date) => void;
}

export function FullCalendarView({
  events,
  timezone = "UTC",
  onEventClick,
  onDateSelect,
  onDatesSet,
}: FullCalendarProps) {
  const { t, locale } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, luxonPlugin]}
      locales={allLocales}
      locale={locale}
      timeZone={timezone}
      events={events}
      eventClick={onEventClick}
      select={onDateSelect}
      datesSet={(info) => onDatesSet?.(info.start, info.end)}
      selectable={true}
      allDaySlot={false}
      headerToolbar={
        isMobile
          ? {
              left: "prev,next",
              center: "title",
              right: "today",
            }
          : {
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,listWeek",
            }
      }
      titleFormat={(args) => {
        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
        const fmt = (date: Date, opts: Intl.DateTimeFormatOptions) =>
          cap(date.toLocaleDateString(locale, opts));

        if (args.end) {
          const start = args.start.marker;
          const end = new Date(args.end.marker.getTime() - 1);
          const startYear = start.getFullYear();
          const endYear = end.getFullYear();

          if (startYear !== endYear) {
            return `${fmt(start, { month: "long", year: "numeric" })} - ${fmt(end, { month: "long", year: "numeric" })}`;
          }
          if (start.getMonth() !== end.getMonth()) {
            return `${fmt(start, { month: "long" })} - ${fmt(end, { month: "long", year: "numeric" })}`;
          }
          return fmt(start, { month: "long", year: "numeric" });
        }
        return fmt(args.start.marker, { month: "long", year: "numeric" });
      }}
      moreLinkText={(num) => `+${num}`}
      height={680}
      scrollTime="08:00:00"
      eventDisplay="block"
      displayEventTime={true}
      displayEventEnd={false}
      dayHeaderContent={(args) => {
        if (args.view.type === "timeGridWeek") {
          const isToday = args.isToday;
          return (
            <div className="fc-week-header-day">
              <span className="fc-week-header-weekday">
                {args.date.toLocaleDateString(locale, { weekday: "short" })}
              </span>
              <span
                className={`fc-week-header-number${isToday ? " fc-week-header-number--today" : ""}`}
              >
                {args.date.getDate()}
              </span>
            </div>
          );
        }
        return args.text;
      }}
      dayHeaderFormat={isMobile ? { weekday: "narrow" } : { weekday: "short" }}
      listDayFormat={{ month: "long", day: "numeric", year: "numeric" }}
      listDaySideFormat={false}
      noEventsContent={t.pages.calendar.noEvents}
      slotLabelFormat={{
        hour: "numeric",
        minute: "2-digit",
        meridiem: "short",
        hour12: true,
      }}
      eventTimeFormat={{
        hour: "numeric",
        minute: "2-digit",
        meridiem: "short",
        hour12: true,
      }}
      initialView={isMobile ? "listWeek" : "timeGridWeek"}
      dayMaxEvents={isMobile ? 2 : 3}
      eventContent={(eventInfo) => (
        <div className="fc-event-inner" title={eventInfo.event.title}>
          <span className="fc-event-inner-time">{eventInfo.timeText}</span>
          <span className="fc-event-inner-title">{eventInfo.event.title}</span>
        </div>
      )}
    />
  );
}
