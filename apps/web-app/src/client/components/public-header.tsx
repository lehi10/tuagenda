"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { LanguageSelectorButton } from "@/client/components/language-selector";
import { useTranslation } from "@/client/i18n";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { headerConfig } from "./public-header.config";

export function PublicHeader() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Block body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Función auxiliar para obtener el valor traducido desde las claves de traducción
  const getTranslation = (key: string) => {
    const traverse = (obj: unknown, parts: string[]): string | null => {
      let value = obj;
      for (const k of parts) {
        if (
          value &&
          typeof value === "object" &&
          k in (value as Record<string, unknown>)
        ) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return null;
        }
      }
      return typeof value === "string" ? value : null;
    };

    const keys = key.split(".");

    // 1. Intenta desde la raíz (cubre t.navigation.X con un solo segmento)
    const fromRoot = traverse(t, keys);
    if (fromRoot) return fromRoot;

    // 2. Intenta desde t.navigation (para claves simples como "features")
    const navValue = t.navigation[key as keyof typeof t.navigation];
    if (navValue) return navValue;

    // 3. Intenta desde t.pages (para rutas como "features.categories.scheduling.title")
    const fromPages = traverse(
      (t as unknown as Record<string, unknown>).pages,
      keys
    );
    if (fromPages) return fromPages;

    return key;
  };

  // Filtrar items habilitados de cada sección
  const productItems = useMemo(() => {
    if (!headerConfig.sections.product.enabled) return [];
    return headerConfig.sections.product.items
      .filter((item) => item.enabled)
      .map((item) => ({
        ...item,
        label: getTranslation(item.label),
        description: item.description
          ? getTranslation(item.description)
          : undefined,
      }));
  }, [t]);

  const solutionsItems = useMemo(() => {
    if (!headerConfig.sections.solutions.enabled) return [];
    return headerConfig.sections.solutions.items
      .filter((item) => item.enabled)
      .map((item) => ({
        ...item,
        label: getTranslation(item.label),
      }));
  }, [t]);

  const companyItems = useMemo(() => {
    if (!headerConfig.sections.company.enabled) return [];
    return headerConfig.sections.company.items
      .filter((item) => item.enabled)
      .map((item) => ({
        ...item,
        label: getTranslation(item.label),
      }));
  }, [t]);

  return (
    <>
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
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary leading-relaxed py-1">
                Producto
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "product" && (
                <div className="absolute left-0 top-full pt-2 w-[640px]">
                  <div className="rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-xl p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {productItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group block rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                item.featured
                                  ? "bg-primary/10 text-primary group-hover:bg-primary/20"
                                  : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                              }`}
                            >
                              <item.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-semibold ${
                                    item.featured
                                      ? "text-primary"
                                      : "text-foreground"
                                  }`}
                                >
                                  {item.label}
                                </span>
                                {item.featured && (
                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                    Destacado
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary leading-relaxed py-1">
                Soluciones
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "solutions" && (
                <div className="absolute left-0 top-full pt-2 w-56">
                  <div className="rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-xl py-2">
                    {solutionsItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-muted/80">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing - Standalone */}
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary leading-relaxed py-1"
            >
              {t.navigation.pricing}
            </Link>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary leading-relaxed py-1">
                Empresa
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === "company" && (
                <div className="absolute left-0 top-full pt-2 w-56">
                  <div className="rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-xl py-2">
                    {companyItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-muted/80">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex lg:gap-3">
            <LanguageSelectorButton />

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
            className="rounded-lg p-2 text-foreground hover:bg-muted lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[3.5rem] sm:top-16 bottom-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur lg:hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-4 min-h-full">
            <nav className="flex flex-col gap-3 pb-20">
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 pb-3 border-b border-border">
                <LanguageSelectorButton />
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

              {/* Mobile Product Section */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Producto
                </div>
                {productItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          item.featured
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              item.featured ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.featured && (
                            <span className="text-xs text-primary/70">★</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground leading-snug">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Solutions Section */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Soluciones
                </div>
                {solutionsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Mobile Pricing */}
              <Link
                href="/pricing"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.navigation.pricing}
              </Link>

              {/* Mobile Company Section */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Empresa
                </div>
                {companyItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
