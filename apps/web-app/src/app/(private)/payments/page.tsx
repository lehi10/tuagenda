"use client"

import { useTranslation } from "@/i18n"

export default function PaymentsPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t.pages.payments.title}</h1>
    </div>
  )
}
