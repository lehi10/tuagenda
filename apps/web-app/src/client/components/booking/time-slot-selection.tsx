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
  isLoading?: boolean;
  error?: string;
}

export function TimeSlotSelection({
  timeSlots,
  selectedSlot,
  onSelect,
  isLoading = false,
  error,
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

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {locale === "es"
            ? "Error al cargar los horarios disponibles. Por favor, intenta nuevamente."
            : "Error loading available time slots. Please try again."}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-11 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      ) : availableSlots.length === 0 ? (
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
