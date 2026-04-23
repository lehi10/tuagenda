"use client";

import { formatPrice } from "@/client/lib/booking-utils";
import type { BookingService } from "@/client/types/booking";

interface LeftPanelSummaryProps {
  bookingData: {
    service?: BookingService;
    professional?: { name: string };
    date?: Date;
    timeSlot?: string;
  };
}

export function LeftPanelSummary({ bookingData }: LeftPanelSummaryProps) {
  const { service, professional, date, timeSlot } = bookingData;

  if (!service && !professional && !date && !timeSlot) return null;

  return (
    <div className="p-5 flex-1">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Resumen
      </p>
      <div className="space-y-2.5">
        {service && (
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-sm">
              📋
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight line-clamp-2">
                {service.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {service.durationMinutes} min
              </p>
            </div>
            <span className="text-sm font-bold text-primary shrink-0">
              {formatPrice(service.price)}
            </span>
          </div>
        )}
        {professional && (
          <div className="rounded-xl bg-muted/60 px-3 py-2.5 flex gap-2 items-center">
            <span className="text-sm">👤</span>
            <p className="text-sm font-semibold">{professional.name}</p>
          </div>
        )}
        {(date || timeSlot) && (
          <div className="rounded-xl bg-muted/60 px-3 py-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">Fecha y hora</p>
            {date && (
              <p className="text-sm font-semibold">
                {date.toLocaleDateString("es", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            )}
            {timeSlot && (
              <p className="text-sm font-semibold text-primary">{timeSlot}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
