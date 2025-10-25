"use client";

import { useTranslation } from "@/i18n";

export function LanguageSelector() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <button
        onClick={() => setLocale("en")}
        className={`hover:text-foreground transition-colors ${
          locale === "en" ? "text-foreground font-medium" : ""
        }`}
      >
        EN
      </button>
      <span className="text-muted-foreground/50">•</span>
      <button
        onClick={() => setLocale("es")}
        className={`hover:text-foreground transition-colors ${
          locale === "es" ? "text-foreground font-medium" : ""
        }`}
      >
        ES
      </button>
    </div>
  );
}
