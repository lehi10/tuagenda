"use client";

import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Separator } from "@/client/components/ui/separator";
import { useTranslation } from "@/client/i18n";
import { X } from "lucide-react";
import { format } from "date-fns";
import { useDateLocale } from "@/client/hooks/use-date-locale";
import { formatPrice } from "@/client/lib/booking-utils";
import type { BookingData } from "@/client/types/booking";

interface BookingSummaryProps {
  bookingData: BookingData;
  onClear: () => void;
  onContinue?: () => void;
  className?: string;
}

export function BookingSummary({
  bookingData,
  onClear,
  onContinue,
  className,
}: BookingSummaryProps) {
  const { t } = useTranslation();
  const dateLocale = useDateLocale();
  const hasAnySelection =
    bookingData.service ||
    bookingData.professional ||
    bookingData.date ||
    bookingData.timeSlot;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t.booking.summary.title}</CardTitle>
          {hasAnySelection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAnySelection ? (
          <p className="text-center text-sm text-muted-foreground">
            {t.booking.steps.service}
          </p>
        ) : (
          <>
            {bookingData.service && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.booking.summary.service}
                </p>
                <p className="font-semibold">{bookingData.service.name}</p>
                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {bookingData.service.durationMinutes}{" "}
                    {t.booking.summary.minutes}
                  </span>
                  <span>{formatPrice(bookingData.service.price)}</span>
                </div>
              </div>
            )}

            {bookingData.professional && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.booking.summary.professional}
                  </p>
                  <p className="font-semibold">
                    {bookingData.professional.name}
                  </p>
                </div>
              </>
            )}

            {bookingData.date && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.booking.summary.date}
                  </p>
                  <p className="font-semibold">
                    {format(bookingData.date, "PPP", { locale: dateLocale })}
                  </p>
                </div>
              </>
            )}

            {bookingData.timeSlot && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.booking.summary.time}
                  </p>
                  <p className="font-semibold">{bookingData.timeSlot}</p>
                </div>
              </>
            )}

            {onContinue &&
              bookingData.service &&
              bookingData.professional &&
              bookingData.date &&
              bookingData.timeSlot && (
                <Button onClick={onContinue} className="w-full">
                  {t.booking.summary.continue}
                </Button>
              )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
