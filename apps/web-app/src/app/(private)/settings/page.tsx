"use client";

import { useTranslation } from "@/client/i18n";
import { SettingsTabs } from "@/client/features/settings/components/settings-tabs";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.pages.settings.title}</h1>
        <p className="text-sm text-muted-foreground">
          Administra la configuración de tu cuenta y negocio
        </p>
      </div>
      <SettingsTabs />
    </div>
  );
}
