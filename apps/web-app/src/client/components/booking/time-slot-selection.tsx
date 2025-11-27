"use client";

import { Button } from "@/client/components/ui/button";
import { useTranslation } from "@/client/i18n";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotSelectionProps {
  timeSlots: TimeSlot[];
  selectedSlot?: string;
  onSelect: (_slot: string) => void;
}

export function TimeSlotSelection({
  timeSlots,
  selectedSlot,
  onSelect,
}: TimeSlotSelectionProps) {
  const { t, locale } = useTranslation();

  const availableSlots = timeSlots.filter((slot) => slot.available);

  return (
    <div className="space-y-5">
      {/* Header - Standardized */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.time.title}
        </h2>
        <p className="text-muted-foreground">
          {locale === "es"
            ? "Selecciona la hora que mejor te convenga"
            : "Select the time that suits you best"}
        </p>
      </div>

      {availableSlots.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t.booking.time.noSlots}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {availableSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={selectedSlot === slot.time ? "default" : "outline"}
              onClick={() => onSelect(slot.time)}
              className="h-11"
            >
              {slot.time}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
