"use client";

import { useTranslation } from "@/i18n";
import Link from "next/link";

export function PublicFooter() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <footer className="relative border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg sm:size-8">
                <svg className="size-4 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:text-lg">
                TuAgenda
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs sm:text-sm">
              La plataforma profesional para gestionar tu negocio de forma eficiente.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-xs font-semibold text-foreground sm:text-sm">Producto</h3>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/about-us" className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm">
                  {t.navigation.aboutUs}
                </Link>
                <Link href="/pricing" className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm">
                  {t.navigation.pricing}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-xs font-semibold text-foreground sm:text-sm">Legal</h3>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/terms-of-service" className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm">
                  {t.legal.termsOfService}
                </Link>
                <Link href="/privacy-policy" className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm">
                  {t.legal.privacyPolicy}
                </Link>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold text-foreground sm:text-sm">Idioma</h3>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "es")}
              className="h-9 w-full max-w-[140px] rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-sm transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 border-t border-border/40 pt-6 sm:mt-8 sm:pt-8">
          <p className="text-center text-xs text-muted-foreground sm:text-sm">
            © 2025 TuAgenda. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
