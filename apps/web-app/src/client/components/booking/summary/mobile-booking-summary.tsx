"use client";

import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Separator } from "@/client/components/ui/separator";
import { useTranslation } from "@/client/i18n";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useDateLocale } from "@/client/hooks/use-date-locale";
import { formatPrice } from "@/client/lib/booking-utils";
import { cn } from "@/client/lib/utils";
import type { BookingData, StepType } from "@/client/types/booking";

const STEP_ORDER: StepType[] = [
  "service",
  "professional",
  "date",
  "time",
  "client-info",
  "payment",
  "confirmation",
];

interface MobileBookingSummaryProps {
  bookingData: BookingData;
  currentStep: StepType;
  onClear: () => void;
}

export function MobileBookingSummary({
  bookingData,
  currentStep,
  onClear,
}: MobileBookingSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, locale } = useTranslation();
  const dateLocale = useDateLocale();

  const hasAnySelection =
    bookingData.service ||
    bookingData.professional ||
    bookingData.date ||
    bookingData.timeSlot;
  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const totalSteps = STEP_ORDER.length - 1;
  const progress = Math.min(currentStepIndex, totalSteps);

  const summaryText = (() => {
    const parts: string[] = [];
    if (bookingData.service) parts.push(bookingData.service.name);
    if (bookingData.professional) parts.push(bookingData.professional.name);
    if (bookingData.date)
      parts.push(format(bookingData.date, "d MMM", { locale: dateLocale }));
    if (bookingData.timeSlot) parts.push(bookingData.timeSlot);
    return parts.length > 0
      ? parts.join(" • ")
      : locale === "es"
        ? "Selecciona un servicio"
        : "Select a service";
  })();

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
          "bg-background border-t shadow-lg rounded-t-2xl transition-all duration-300 ease-out",
          isExpanded ? "max-h-[70vh]" : "max-h-[72px]"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Collapsed bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 pb-3 flex items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 w-4 rounded-full transition-colors",
                      i < progress ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {progress}/{totalSteps}
              </span>
            </div>
            <p className="text-sm font-medium truncate text-left">
              {summaryText}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {bookingData.service && (
              <span className="font-semibold text-primary">
                {formatPrice(bookingData.service.price)}
              </span>
            )}
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-4 pb-6 overflow-y-auto max-h-[calc(70vh-72px)]">
            <Separator className="mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t.booking.summary.title}</h3>
              {hasAnySelection && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                    setIsExpanded(false);
                  }}
                  className="h-8 px-2 text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  {locale === "es" ? "Limpiar" : "Clear"}
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {bookingData.service && (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {t.booking.summary.service}
                    </p>
                    <p className="font-medium">{bookingData.service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.service.durationMinutes}{" "}
                      {t.booking.summary.minutes}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(bookingData.service.price)}
                  </span>
                </div>
              )}
              {bookingData.professional && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t.booking.summary.professional}
                  </p>
                  <p className="font-medium">{bookingData.professional.name}</p>
                </div>
              )}
              {bookingData.date && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t.booking.summary.date}
                  </p>
                  <p className="font-medium">
                    {format(bookingData.date, "PPPP", { locale: dateLocale })}
                  </p>
                </div>
              )}
              {bookingData.timeSlot && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t.booking.summary.time}
                  </p>
                  <p className="font-medium">{bookingData.timeSlot}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-[72px] lg:hidden" />
    </>
  );
}
