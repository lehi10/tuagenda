"use client";

import { useTranslation } from "@/client/i18n";
import { es, enUS } from "date-fns/locale";
import {
  format,
  addDays,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday,
  isTomorrow,
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
  const { t, locale } = useTranslation(); // locale still needed for date-fns format
  const dateLocale = locale === "es" ? es : enUS;
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(today);

  const quickDates = [
    { date: today, label: t.booking.date.today },
    { date: addDays(today, 1), label: t.booking.date.tomorrow },
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

  const isDateSelected = (date: Date) =>
    selectedDate ? isSameDay(date, selectedDate) : false;

  const isDateDisabled = (date: Date) => date < today;

  const getSelectedDateLabel = () => {
    if (!selectedDate) return null;
    if (isToday(selectedDate)) return t.booking.date.today;
    if (isTomorrow(selectedDate)) return t.booking.date.tomorrow;
    return format(selectedDate, "EEEE d 'de' MMMM", { locale: dateLocale });
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const weekDaysShort =
    locale === "es"
      ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.date.title}
        </h2>
        <p className="text-muted-foreground">{t.booking.date.hint}</p>
      </div>

      {/* Quick date pills */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 sm:flex-wrap">
          {quickDates.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelect(item.date)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border",
                isDateSelected(item.date)
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-card rounded-2xl border shadow-sm p-5 sm:p-6 max-w-md">
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

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {daysInMonth.map((date) => {
            const isSelected = isDateSelected(date);
            const isDisabled = isDateDisabled(date);
            const isTodayDate = isToday(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => !isDisabled && onSelect(date)}
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

        {/* Selected date confirmation */}
        {selectedDate && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <p className="text-sm font-semibold text-primary capitalize">
              📅 {getSelectedDateLabel()}
            </p>
            <button
              onClick={() => onSelect(undefined)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.booking.date.change}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
