"use client";

import { useTranslation } from "@/i18n";
import { ClientStats } from "@/features/clients/components/client-stats";
import { ClientList } from "@/features/clients/components/client-list";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{t.pages.clients.title}</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {t.pages.clients.clientList}
          </p>
        </div>
        <Button className="w-full sm:w-auto">{t.pages.clients.addClient}</Button>
      </div>
      <ClientStats />
      <ClientList />
    </div>
  );
}
