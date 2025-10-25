"use client"

import { useTranslation } from "@/i18n"
import { ClientStats } from "@/features/clients/components/client-stats"
import { ClientList } from "@/features/clients/components/client-list"
import { Button } from "@/components/ui/button"

export default function ClientsPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.pages.clients.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.pages.clients.clientList}
          </p>
        </div>
        <Button>{t.pages.clients.addClient}</Button>
      </div>
      <ClientStats />
      <ClientList />
    </div>
  )
}
