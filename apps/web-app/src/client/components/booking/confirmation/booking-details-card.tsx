/**
 * Booking Details Card Component
 *
 * Displays the booking details in the confirmation step.
 */

import { Card, CardContent } from "@/client/components/ui/card";
import { Separator } from "@/client/components/ui/separator";
import { useTranslation } from "@/client/i18n";
import { Calendar, Clock, User, CreditCard, Hash } from "lucide-react";
import { format } from "date-fns";
import { InfoDisplayItem } from "@/client/components/booking/shared/info-display-item";
import { useDateLocale } from "@/client/hooks/use-date-locale";
import { formatPrice, getPaymentMethodLabel } from "@/client/lib/booking-utils";
import type { BookingSummary } from "@/client/types/booking";

interface BookingDetailsCardProps {
  bookingSummary: BookingSummary;
  appointmentId: string | null;
}

export function BookingDetailsCard({
  bookingSummary,
  appointmentId,
}: BookingDetailsCardProps) {
  const { t } = useTranslation();
  const dateLocale = useDateLocale();

  const paymentMethodLabels: Record<string, string> = {
    card: t.booking.payment.methods.card,
    onsite: t.booking.payment.methods.cash,
    "digital-wallet": t.booking.payment.methods.wallet,
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {t.booking.confirmation.detailsTitle}
        </h3>

        <div className="space-y-3">
          {/* Service */}
          <InfoDisplayItem
            icon={Calendar}
            value={bookingSummary.service.name}
            subValue={`${bookingSummary.service.durationMinutes} ${t.booking.summary.minutes} • ${formatPrice(bookingSummary.service.price)}`}
          />

          {/* Professional */}
          {bookingSummary.professional && (
            <>
              <Separator />
              <InfoDisplayItem
                icon={User}
                value={bookingSummary.professional.name}
              />
            </>
          )}

          {/* Date & Time */}
          <Separator />
          <InfoDisplayItem
            icon={Clock}
            value={format(bookingSummary.date, "PPP", { locale: dateLocale })}
            subValue={bookingSummary.timeSlot}
          />

          {/* Payment Method */}
          <Separator />
          <InfoDisplayItem
            icon={CreditCard}
            value={getPaymentMethodLabel(
              bookingSummary.paymentMethod,
              paymentMethodLabels
            )}
          />

          {/* Confirmation Number */}
          {appointmentId && (
            <>
              <Separator />
              <InfoDisplayItem
                icon={Hash}
                value={t.booking.confirmation.confirmationNumber}
                subValue={appointmentId.slice(0, 8).toUpperCase()}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
