/**
 * Location Map Component
 *
 * Displays a map with the business location for in-person appointments.
 */

import { Card, CardContent } from "@/client/components/ui/card";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { getGoogleMapsDirectionsUrl, getGoogleMapsEmbedUrl } from "@/client/lib/booking-utils";
import type { BusinessLocation } from "@/client/types/booking";

interface LocationMapProps {
  location: BusinessLocation;
  googleMapsApiKey?: string;
}

export function LocationMap({ location, googleMapsApiKey }: LocationMapProps) {
  const { t } = useTranslation();

  const directionsUrl = getGoogleMapsDirectionsUrl(
    location.address,
    location.lat,
    location.lng
  );

  const embedUrl = googleMapsApiKey
    ? getGoogleMapsEmbedUrl(location.address, googleMapsApiKey)
    : "";

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          {t.booking.confirmation.locationTitle}
        </h3>

        <p className="mb-4 text-sm text-muted-foreground">{location.address}</p>

        {/* Google Maps Embed */}
        {embedUrl ? (
          <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-muted">
            <div className="text-center text-sm text-muted-foreground">
              <MapPin className="mx-auto mb-2 h-8 w-8" />
              <p>{t.booking.confirmation.mapUnavailable || "Map unavailable"}</p>
            </div>
          </div>
        )}

        {/* Directions Link */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <MapPin className="h-4 w-4" />
          {t.booking.confirmation.howToGetThere}
        </a>
      </CardContent>
    </Card>
  );
}
