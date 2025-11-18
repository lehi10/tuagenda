"use client";

import { Button } from "@/client/components/ui/button";
import { useTranslation } from "@/client/i18n";
import { CheckCircle2 } from "lucide-react";
import { BookingDetailsCard } from "@/client/components/booking/confirmation/booking-details-card";
import { LocationMap } from "@/client/components/booking/confirmation/location-map";
import { EmailNotice } from "@/client/components/booking/confirmation/email-notice";
import type { BookingSummary } from "@/client/types/booking";

interface ConfirmationStepProps {
  bookingSummary: BookingSummary;
  onBackToHome: () => void;
}

export function ConfirmationStep({
  bookingSummary,
  onBackToHome,
}: ConfirmationStepProps) {
  const { t } = useTranslation();

  const isInPerson = true; // Default to in-person for now
  const hasLocation = bookingSummary.businessLocation;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Success Message */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
          {t.booking.confirmation.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.booking.confirmation.subtitle}
        </p>
      </div>

      {/* Two Column Layout: Booking Details + Map */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Booking Details + Email Notice */}
        <div className="space-y-6">
          <BookingDetailsCard bookingSummary={bookingSummary} />
          <EmailNotice email={bookingSummary.clientInfo.email} />
        </div>

        {/* Right Column: Location Map */}
        {isInPerson && hasLocation && (
          <LocationMap
            location={bookingSummary.businessLocation}
            googleMapsApiKey={googleMapsApiKey}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onBackToHome} size="lg" className="sm:min-w-[200px]">
          {t.booking.confirmation.makeAnotherBooking}
        </Button>
      </div>
    </div>
  );
}
