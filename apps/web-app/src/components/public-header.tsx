"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import Link from "next/link";

export function PublicHeader() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="font-semibold">TuAgenda</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/about-us"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.navigation.aboutUs}
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.navigation.pricing}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Selector Dropdown */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "en" | "es")}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t.auth.login}
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">{t.auth.signUp}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
