"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/i18n";
import { X } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface BookingData {
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  professional?: {
    id: string;
    name: string;
  };
  date?: Date;
  timeSlot?: string;
}

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
  const { t, locale } = useTranslation();
  const hasAnySelection =
    bookingData.service ||
    bookingData.professional ||
    bookingData.date ||
    bookingData.timeSlot;

  const dateLocale = locale === "es" ? es : enUS;

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
                    {bookingData.service.duration} {t.booking.summary.minutes}
                  </span>
                  <span>${bookingData.service.price}</span>
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
