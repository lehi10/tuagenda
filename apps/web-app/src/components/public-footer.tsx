"use client"

import { useTranslation } from "@/i18n"

export function PublicFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© 2025 TuAgenda. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="/terms-of-service" className="hover:underline">
            {t.legal.termsOfService}
          </a>
          <a href="/privacy-policy" className="hover:underline">
            {t.legal.privacyPolicy}
          </a>
        </div>
      </div>
    </footer>
  )
}
