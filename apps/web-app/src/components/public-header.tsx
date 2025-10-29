"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function PublicHeader() {
  const { t, locale, setLocale } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16">
        <Link href="/" className="group flex items-center font-medium">
          <Image
            src="/icons/2_horizontal_color.png"
            alt="TuAgenda"
            width={140}
            height={32}
            className="h-8 w-auto transition-opacity group-hover:opacity-90"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex lg:gap-8">
          <Link
            href="/about-us"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t.navigation.aboutUs}
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t.navigation.pricing}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex lg:gap-3">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "en" | "es")}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>

          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-medium">
              {t.auth.login}
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="font-medium shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
            >
              {t.auth.signUp}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden rounded-lg p-2 text-foreground hover:bg-muted"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-3">
              <Link
                href="/about-us"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.navigation.aboutUs}
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.navigation.pricing}
              </Link>

              <div className="my-2 border-t border-border" />

              <div className="flex flex-col gap-2">
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as "en" | "es")}
                  className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>

                <Link
                  href="/login"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-medium"
                  >
                    {t.auth.login}
                  </Button>
                </Link>
                <Link
                  href="/signup"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    size="sm"
                    className="w-full font-medium shadow-lg shadow-primary/25"
                  >
                    {t.auth.signUp}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
