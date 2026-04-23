"use client";

import { useState, useRef } from "react";
import {
  format,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from "date-fns";
import { es, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { useUserTimezone } from "@/client/contexts/user-timezone-context";
import { formatInTz } from "@/client/lib/timezone-utils";
import { useTrpc } from "@/client/lib/trpc";
import { cn } from "@/client/lib/utils";
import type { TimeSlot } from "@/client/types/booking";

interface DateTimeSelectionProps {
  professionalId: string;
  serviceId: string;
  selectedDate?: Date;
  selectedSlot?: string;
  onDateChange: (_date: Date | undefined) => void;
  onSlotSelect: (_slot: TimeSlot) => void;
}

export function DateTimeSelection({
  professionalId,
  serviceId,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotSelect,
}: DateTimeSelectionProps) {
  const { t, locale } = useTranslation();
  const { timezone: userTimezone } = useUserTimezone();
  const dateLocale = locale === "es" ? es : enUS;
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(today);
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (date: Date | undefined) => {
    onDateChange(date);
    if (date) {
      setTimeout(() => {
        timeSlotsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  };

  const { data, isLoading, error } =
    useTrpc.businessUser.getAvailableTimeSlots.useQuery(
      {
        businessUserId: professionalId,
        serviceId,
        date: selectedDate ?? today,
      },
      { enabled: !!professionalId && !!serviceId && !!selectedDate }
    );

  const timeSlots = data?.slots ?? [];
  const businessTimezone = data?.businessTimezone ?? "UTC";
  const availableSlots = timeSlots.filter((s) => s.available);
  const showingInUserTz = userTimezone !== businessTimezone;

  // ── Calendar helpers ───────────────────────────────────────────

  const weekDaysShort =
    locale === "es"
      ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const isDateSelected = (date: Date) =>
    selectedDate ? isSameDay(date, selectedDate) : false;

  const isDateDisabled = (date: Date) => date < today;

  function getDisplayTime(slot: TimeSlot): string {
    return formatInTz(slot.startTime, userTimezone, "h:mm a");
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {locale === "es" ? "Fecha y horario" : "Date & time"}
        </h2>
        <p className="text-muted-foreground text-sm">
          {locale === "es"
            ? "Elige el día y la hora que prefieras"
            : "Choose your preferred day and time"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* ── Left: calendar ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Calendar card */}
          <div className="bg-card rounded-2xl border shadow-sm p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
              </h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {weekDaysShort.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-muted-foreground py-2"
                >
                  {day.slice(0, 2)}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {daysInMonth.map((date) => {
                const isSelected = isDateSelected(date);
                const isDisabled = isDateDisabled(date);
                const isTodayDate = isToday(date);
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => !isDisabled && handleDateChange(date)}
                    disabled={isDisabled}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-xl",
                      "text-sm font-medium transition-all",
                      isSelected &&
                        "bg-primary text-primary-foreground font-bold shadow-sm",
                      !isSelected &&
                        isTodayDate &&
                        "ring-2 ring-primary/40 text-primary font-bold",
                      !isSelected &&
                        !isDisabled &&
                        !isTodayDate &&
                        "hover:bg-primary/10 hover:text-primary",
                      isDisabled && "opacity-25 cursor-not-allowed"
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Selected date row */}
            {selectedDate && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <p className="text-sm font-semibold text-primary capitalize">
                  📅{" "}
                  {isToday(selectedDate)
                    ? t.booking.date.today
                    : format(selectedDate, "EEEE d 'de' MMMM", {
                        locale: dateLocale,
                      })}
                </p>
                <button
                  onClick={() => handleDateChange(undefined)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.booking.date.change}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: time slots ───────────────────────────────── */}
        <div ref={timeSlotsRef} className="space-y-4">
          {!selectedDate ? (
            <div className="rounded-2xl border border-dashed bg-muted/30 py-14 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-3xl">📅</span>
              <p className="text-sm font-medium text-muted-foreground">
                {locale === "es"
                  ? "Primero selecciona una fecha"
                  : "Select a date first"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {locale === "es" ? "Horarios disponibles" : "Available times"}
                </p>
                {!isLoading && availableSlots.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {showingInUserTz
                      ? `En tu zona horaria (${userTimezone})`
                      : `Zona horaria del negocio (${businessTimezone})`}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                  {locale === "es"
                    ? "Error al cargar los horarios. Intenta nuevamente."
                    : "Error loading time slots. Please try again."}
                </div>
              )}

              {/* Loading skeleton */}
              {isLoading && (
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-xl bg-muted"
                    />
                  ))}
                </div>
              )}

              {/* No slots */}
              {!isLoading && !error && availableSlots.length === 0 && (
                <div className="rounded-2xl border border-dashed bg-muted/30 py-10 flex flex-col items-center gap-2 text-center">
                  <span className="text-2xl">😔</span>
                  <p className="text-sm text-muted-foreground">
                    {locale === "es"
                      ? "Sin horarios disponibles para este día"
                      : "No available slots for this day"}
                  </p>
                </div>
              )}

              {/* Slots grid */}
              {!isLoading && availableSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        onClick={() => onSlotSelect(slot)}
                        className={cn(
                          "h-12 rounded-xl text-sm font-semibold border transition-all",
                          "hover:shadow-sm active:scale-[0.97]",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        {getDisplayTime(slot)}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
