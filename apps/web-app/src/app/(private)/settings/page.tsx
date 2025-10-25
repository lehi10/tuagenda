"use client";

import { useTranslation } from "@/i18n";
import { SettingsTabs } from "@/features/settings/components/settings-tabs";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.pages.settings.title}</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>
      <SettingsTabs />
    </div>
  );
}
