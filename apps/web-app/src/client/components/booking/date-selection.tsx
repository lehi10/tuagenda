"use client";

import { useTranslation } from "@/client/i18n";
import { es, enUS } from "date-fns/locale";
import {
  format,
  isToday,
  isTomorrow,
  addDays,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { cn } from "@/client/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DateSelectionProps {
  selectedDate?: Date;
  onSelect: (_date: Date | undefined) => void;
  availableDates?: Date[];
}

export function DateSelection({ selectedDate, onSelect }: DateSelectionProps) {
  const { t, locale } = useTranslation();
  const dateLocale = locale === "es" ? es : enUS;
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(today);

  // Quick date selection options
  const quickDates = [
    { date: today, label: locale === "es" ? "Hoy" : "Today" },
    { date: addDays(today, 1), label: locale === "es" ? "Mañana" : "Tomorrow" },
    {
      date: addDays(today, 2),
      label: format(addDays(today, 2), "EEE d", { locale: dateLocale }),
    },
    {
      date: addDays(today, 3),
      label: format(addDays(today, 3), "EEE d", { locale: dateLocale }),
    },
    {
      date: addDays(today, 4),
      label: format(addDays(today, 4), "EEE d", { locale: dateLocale }),
    },
  ];

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return isSameDay(date, selectedDate);
  };

  const isDateDisabled = (date: Date) => {
    return date < today;
  };

  const getSelectedDateLabel = () => {
    if (!selectedDate) return null;
    if (isToday(selectedDate)) return locale === "es" ? "Hoy" : "Today";
    if (isTomorrow(selectedDate))
      return locale === "es" ? "Mañana" : "Tomorrow";
    return format(selectedDate, "EEEE d 'de' MMMM", { locale: dateLocale });
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for the first day (0 = Sunday)
  const startDayOfWeek = getDay(monthStart);

  // Weekday labels
  const weekDays =
    locale === "es"
      ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onSelect(date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.date.title}
        </h2>
        <p className="text-muted-foreground">
          {locale === "es"
            ? "Elige el día que prefieras"
            : "Choose your preferred day"}
        </p>
      </div>

      {/* Quick date selection */}
      <div className="flex justify-center">
        <div className="inline-flex gap-2 p-1.5 bg-muted/50 rounded-xl overflow-x-auto max-w-full">
          {quickDates.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelect(item.date)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                "hover:bg-background/80",
                isDateSelected(item.date)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <div className="w-full max-w-[420px] bg-card rounded-2xl border shadow-sm p-5 sm:p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <h3 className="text-lg font-semibold capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of month */}
            {Array.from({ length: startDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((date) => {
              const isSelected = isDateSelected(date);
              const isDisabled = isDateDisabled(date);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-full",
                    "text-sm sm:text-base font-medium transition-all",
                    "hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    !isSelected && isTodayDate && "ring-2 ring-primary/40",
                    isDisabled &&
                      "opacity-30 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Selected date display */}
          {selectedDate && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-center text-sm">
                <span className="text-muted-foreground">
                  {locale === "es" ? "Seleccionado: " : "Selected: "}
                </span>
                <span className="font-semibold text-foreground capitalize">
                  {getSelectedDateLabel()}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
