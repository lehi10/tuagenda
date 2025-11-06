"use client";

import { Calendar } from "@/components/ui/calendar";
import { useTranslation } from "@/i18n";
import { es, enUS } from "date-fns/locale";

interface DateSelectionProps {
  selectedDate?: Date;
  onSelect: (_date: Date | undefined) => void;
  availableDates?: Date[];
}

export function DateSelection({ selectedDate, onSelect }: DateSelectionProps) {
  const { t, locale } = useTranslation();

  const dateLocale = locale === "es" ? es : enUS;

  // Disable past dates
  const disabledDays = { before: new Date() };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.booking.date.title}</h2>
      </div>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          disabled={disabledDays}
          locale={dateLocale}
          className="rounded-md border"
        />
      </div>
    </div>
  );
}
