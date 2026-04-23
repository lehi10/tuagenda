"use client";

import { useTranslation } from "@/client/i18n";
import { useUserTimezone } from "@/client/contexts/user-timezone-context";
import { formatInTz } from "@/client/lib/timezone-utils";
import { cn } from "@/client/lib/utils";
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
  const { t } = useTranslation();
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
        <p className="text-muted-foreground">{t.booking.time.hint}</p>
      </div>

      {/* Timezone indicator */}
      {!isLoading && availableSlots.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {showingInUserTz
            ? `${t.booking.time.timezoneUser} (${userTimezone})`
            : `${t.booking.time.timezoneBusiness} (${businessTimezone})`}
        </p>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
          {t.booking.time.errorLoading}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t.booking.time.noSlots}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
          {availableSlots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            return (
              <button
                key={slot.time}
                onClick={() => onSelect(slot)}
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

      {/* Legend */}
      {!isLoading && availableSlots.length > 0 && (
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-xs text-muted-foreground">
              {t.booking.time.selected}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-card border border-border" />
            <span className="text-xs text-muted-foreground">
              {t.booking.professional.available}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
