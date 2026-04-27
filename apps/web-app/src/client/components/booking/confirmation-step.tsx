"use client";

import { useMemo } from "react";
import { Button } from "@/client/components/ui/button";
import { useTranslation } from "@/client/i18n";
import { format } from "date-fns";
import { useDateLocale } from "@/client/hooks/use-date-locale";
import { formatPrice, getPaymentMethodLabel } from "@/client/lib/booking-utils";
import { LocationMap } from "@/client/components/booking/confirmation/location-map";
import { EmailNotice } from "@/client/components/booking/confirmation/email-notice";
import type { BookingSummary } from "@/client/types/booking";

interface ConfirmationStepProps {
  bookingSummary: BookingSummary;
  appointmentId: string | null;
  onBackToHome: () => void;
}

export function ConfirmationStep({
  bookingSummary,
  appointmentId,
  onBackToHome,
}: ConfirmationStepProps) {
  const { t } = useTranslation();
  const dateLocale = useDateLocale();
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isInPerson = true;
  const hasLocation = bookingSummary.businessLocation;

  const paymentMethodLabels: Record<string, string> = {
    card: t.booking.payment.methods.card,
    onsite: t.booking.payment.methods.cash,
    "digital-wallet": t.booking.payment.methods.wallet,
  };

  // Human-friendly booking code derived from the appointment ID
  const bookingCode = useMemo(() => {
    if (appointmentId) {
      return "TA-" + appointmentId.slice(0, 6).toUpperCase().replace(/-/g, "");
    }
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return (
      "TA-" +
      Array.from(
        { length: 6 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("")
    );
  }, [appointmentId]);

  const details = [
    {
      emoji: "📋",
      label: t.booking.summary.service,
      value: bookingSummary.service.name,
      sub: `${bookingSummary.service.durationMinutes} min · ${formatPrice(bookingSummary.service.price, bookingSummary.currency)}`,
    },
    {
      emoji: "📅",
      label: t.booking.summary.date,
      value: format(bookingSummary.date, "PPP", { locale: dateLocale }),
    },
    {
      emoji: "⏰",
      label: t.booking.summary.time,
      value: bookingSummary.timeSlot,
    },
    ...(bookingSummary.professional
      ? [
          {
            emoji: "👤",
            label: t.booking.summary.professional,
            value: bookingSummary.professional.name,
          },
        ]
      : []),
    ...(bookingSummary.paymentMethod
      ? [
          {
            emoji: "💳",
            label: t.booking.confirmation.paymentMethod,
            value: getPaymentMethodLabel(
              bookingSummary.paymentMethod,
              paymentMethodLabels
            ) as string,
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      {/* ── Gradient success header ─────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-5">
          {/* Check icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
              <path
                d="M8 22L18 32L36 12"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xl sm:text-2xl font-bold mb-1">
              {t.booking.confirmation.title}
            </p>
            <p className="text-white/75 text-sm mb-4">
              {t.booking.confirmation.subtitle}
            </p>
            {/* Booking code pill */}
            <div className="inline-block bg-white/15 rounded-xl px-4 py-2.5">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">
                {t.booking.confirmation.bookingCode}
              </p>
              <p className="text-white text-base font-bold tracking-[0.2em]">
                {bookingCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column detail area ───────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Booking details card */}
        <div className="rounded-2xl border bg-card p-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {t.booking.confirmation.detailsTitle}
          </p>
          <div className="divide-y">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-5 text-center text-sm shrink-0">
                  {item.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold capitalize truncate">
                    {item.value}
                  </p>
                  {item.sub && (
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2.5">
            <button
              onClick={() => {
                const phone = "";
                const text = `Mi reserva: ${bookingCode} — ${bookingSummary.service.name} el ${format(bookingSummary.date, "PPP", { locale: dateLocale })} a las ${bookingSummary.timeSlot}`;
                window.open(
                  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
                  "_blank"
                );
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white hover:bg-[#20BA5A] transition-colors"
            >
              💬 {t.booking.confirmation.whatsapp}
            </button>
            <button
              onClick={() => {
                // Add to calendar via Google Calendar
                const start =
                  format(bookingSummary.date, "yyyyMMdd") +
                  "T" +
                  bookingSummary.timeSlot.replace(":", "") +
                  "00";
                const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(bookingSummary.service.name)}&dates=${start}/${start}`;
                window.open(url, "_blank");
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-muted border py-2.5 text-sm font-semibold hover:bg-muted/80 transition-colors"
            >
              📅 {t.booking.confirmation.calendar}
            </button>
          </div>
        </div>

        {/* Location or right column */}
        <div className="space-y-4">
          {isInPerson && hasLocation && bookingSummary.businessLocation && (
            <LocationMap
              location={bookingSummary.businessLocation}
              googleMapsApiKey={googleMapsApiKey}
            />
          )}
          <EmailNotice email={bookingSummary.clientInfo.email} />
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center pt-2">
        <Button
          onClick={onBackToHome}
          size="lg"
          className="sm:min-w-[200px] rounded-xl h-12 font-semibold"
        >
          {t.booking.confirmation.makeAnotherBooking}
        </Button>
      </div>
    </div>
  );
}
