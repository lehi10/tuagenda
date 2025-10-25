"use client"

import { useTranslation } from "@/i18n"
import { ServiceStats } from "@/features/services/components/service-stats"
import { ServiceList } from "@/features/services/components/service-list"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.pages.services.title}</h1>
          <p className="text-sm text-muted-foreground">
            Manage your service catalog
          </p>
        </div>
        <Button>{t.pages.services.addService}</Button>
      </div>
      <ServiceStats />
      <ServiceList />
    </div>
  )
}
