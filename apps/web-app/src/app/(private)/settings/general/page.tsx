"use client";

import { useBusiness } from "@/client/contexts";
import {
  BusinessInfoSection,
  RegionalizationSection,
  SocialLinksSection,
} from "@/client/features/settings/components";

export default function GeneralSettingsPage() {
  const { currentBusiness, refreshBusinesses } = useBusiness();

  if (!currentBusiness) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">General</h1>
        <p className="text-sm text-muted-foreground">
          Configuración general de tu negocio
        </p>
      </div>
      <BusinessInfoSection
        business={currentBusiness}
        onUpdate={refreshBusinesses}
      />
      <RegionalizationSection
        business={currentBusiness}
        onUpdate={refreshBusinesses}
      />
      <SocialLinksSection
        business={currentBusiness}
        onUpdate={refreshBusinesses}
      />
    </div>
  );
}
