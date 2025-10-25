"use client";

import { useTranslation } from "@/i18n";

export function PublicFooter() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 TuAgenda. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <a href="/terms-of-service" className="hover:underline">
              {t.legal.termsOfService}
            </a>
            <a href="/privacy-policy" className="hover:underline">
              {t.legal.privacyPolicy}
            </a>
            <a href="/about-us" className="hover:underline">
              {t.navigation.aboutUs}
            </a>
            <a href="/pricing" className="hover:underline">
              {t.navigation.pricing}
            </a>
          </div>
          {/* Language Selector Dropdown */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "en" | "es")}
            className="h-8 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
    </footer>
  );
}
