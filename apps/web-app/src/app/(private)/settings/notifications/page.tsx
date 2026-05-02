"use client";

import { useBusiness } from "@/client/contexts";
import { NotificationChannelsSection } from "@/client/features/settings/components";

export default function NotificationsSettingsPage() {
  const { currentBusiness, refreshBusinesses } = useBusiness();

  if (!currentBusiness) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <p className="text-sm text-muted-foreground">
          Configura cómo y por dónde se notifica a tus clientes sobre sus citas
        </p>
      </div>
      <NotificationChannelsSection
        business={currentBusiness}
        onUpdate={refreshBusinesses}
      />
    </div>
  );
}
