"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { pt } from "./locales/pt";
import { qu } from "./locales/qu";
import type { Translations } from "./locales/en";

export type Locale = "en" | "es" | "pt" | "qu" | "fr" | "gn";

const translations: Record<Locale, Translations> = {
  en,
  es,
  pt,
  qu,
  fr: es, // Temporal hasta crear el archivo
  gn: es, // Temporal hasta crear el archivo
};

const LOCALE_STORAGE_KEY = "tuagenda-locale";

interface I18nContextType {
  locale: Locale;
  setLocale: (_locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start with default locale for SSR
  const [locale, setLocaleState] = useState<Locale>("es");
  const [mounted, setMounted] = useState(false);

  // Load locale from localStorage after mount (client-side only)
  useEffect(() => {
    setMounted(true);

    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored && (stored === "en" || stored === "es" || stored === "pt" || stored === "qu" || stored === "fr" || stored === "gn")) {
        setLocaleState(stored as Locale);
      }
    } catch (error) {
      console.error("Error reading locale from localStorage:", error);
    }
  }, []);

  // Persist locale to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch (error) {
      console.error("Error saving locale to localStorage:", error);
    }
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const value = {
    locale,
    setLocale,
    t: translations[locale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
