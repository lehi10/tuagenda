"use client";

import { Clock } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { ImageGallery } from "@/client/components/ui/image-gallery";
import { formatPrice } from "@/client/lib/booking-utils";
import { useTranslation } from "@/client/i18n";
import type { BookingService } from "@/client/types/booking";

interface ServiceDetailStepProps {
  service: BookingService;
  currency: string;
  onConfirm: () => void;
}

// ###TODO### – replace with real service icon/emoji based on category
function ServiceEmoji({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (
    lower.includes("corte") ||
    lower.includes("cabello") ||
    lower.includes("peinado")
  )
    return <>✂️</>;
  if (
    lower.includes("uña") ||
    lower.includes("manicure") ||
    lower.includes("pedicure")
  )
    return <>💅</>;
  if (lower.includes("facial") || lower.includes("limpieza")) return <>✨</>;
  if (
    lower.includes("médic") ||
    lower.includes("medic") ||
    lower.includes("dental")
  )
    return <>🩺</>;
  if (lower.includes("mecánic") || lower.includes("mecanic")) return <>🔧</>;
  if (
    lower.includes("gym") ||
    lower.includes("entrenador") ||
    lower.includes("fitness")
  )
    return <>💪</>;
  return <>📋</>;
}

export function ServiceDetailStep({
  service,
  currency,
  onConfirm,
}: ServiceDetailStepProps) {
  const { t } = useTranslation();
  const isFree = service.price === 0;
  const hasPrice = service.price !== null && service.price !== undefined;
  const hasImages = service.images.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        {/* Hero header */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 14px)",
            }}
          />
          <div className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg">
            <ServiceEmoji name={service.name} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Title + badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold leading-snug mb-2">
                {service.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {service.durationMinutes} min
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="shrink-0 text-right">
              {isFree ? (
                <span className="text-base font-bold text-green-600 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
                  {t.booking.service.free}
                </span>
              ) : hasPrice ? (
                <span className="text-xl font-bold text-primary">
                  {formatPrice(service.price, currency)}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t.booking.service.toCoordinate}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          )}

          {/* Gallery */}
          {hasImages && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t.booking.service.gallery}
              </p>
              <ImageGallery images={service.images} alt={service.name} />
            </div>
          )}
        </div>
      </div>

      {/* CTA sticky on mobile */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-background/80 backdrop-blur-sm -mx-4 px-4 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:mx-0 sm:px-0 sm:pt-5 sm:pb-0">
        <Button
          onClick={onConfirm}
          className="w-full h-12 rounded-xl font-semibold text-base shadow-lg shadow-primary/20"
          size="lg"
        >
          {t.booking.service.bookThis} →
        </Button>
      </div>
    </div>
  );
}
