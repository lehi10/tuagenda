"use client";

import { Button } from "@/client/components/ui/button";
import { useTranslation } from "@/client/i18n";
import { useUserTimezone } from "@/client/contexts/user-timezone-context";
import { formatInTz } from "@/client/lib/timezone-utils";
import type { TimeSlot } from "@/client/types/booking";

interface TimeSlotSelectionProps {
  timeSlots: TimeSlot[];
  selectedSlot?: string;
  onSelect: (_slot: TimeSlot) => void;
  isLoading?: boolean;
  error?: string;
  businessTimezone: string;
}

export function TimeSlotSelection({
  timeSlots,
  selectedSlot,
  onSelect,
  isLoading = false,
  error,
  businessTimezone,
}: TimeSlotSelectionProps) {
  const { t, locale } = useTranslation();
  const { timezone: userTimezone } = useUserTimezone();
  const showingInUserTz = userTimezone !== businessTimezone;

  const availableSlots = timeSlots.filter((slot) => slot.available);

  function getDisplayTime(slot: TimeSlot): string {
    return formatInTz(slot.startTime, userTimezone, "h:mm a");
  }

  return (
    <div className="space-y-5">
      {/* Header */}
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

      {/* Timezone indicator */}
      {!isLoading && availableSlots.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {showingInUserTz
            ? `Horarios en tu zona horaria (${userTimezone})`
            : `Horarios en zona horaria del negocio (${businessTimezone})`}
        </p>
      )}

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
            <div key={i} className="h-11 animate-pulse rounded-md bg-muted" />
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
              onClick={() => onSelect(slot)}
              className="h-11"
            >
              {getDisplayTime(slot)}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
