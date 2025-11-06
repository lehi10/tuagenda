"use client";

import { useTranslation } from "@/i18n";
import { NotificationList } from "@/features/notifications/components/notification-list";

export default function NotificationsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.pages.notifications.title}</h1>
        <p className="text-sm text-muted-foreground">
          Stay updated with your business activities
        </p>
      </div>
      <NotificationList />
    </div>
  );
}
