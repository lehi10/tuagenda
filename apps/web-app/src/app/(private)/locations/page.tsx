"use client";

import { useTranslation } from "@/i18n";
import { LocationStats } from "@/features/locations/components/location-stats";
import { LocationList } from "@/features/locations/components/location-list";
import { Button } from "@/components/ui/button";

export default function LocationsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.pages.locations.title}</h1>
          <p className="text-sm text-muted-foreground">
            Manage your business locations
          </p>
        </div>
        <Button>{t.pages.locations.addLocation}</Button>
      </div>
      <LocationStats />
      <LocationList />
    </div>
  );
}
