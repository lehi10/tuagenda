/**
 * Currency Utilities
 *
 * Helpers for formatting prices using ISO 4217 currency codes.
 * Relies on the browser's Intl.NumberFormat API — no manual symbol maps needed.
 */

/**
 * Maps ISO 4217 currency codes to a sensible display locale.
 * The locale affects symbol style (e.g. "S/" vs "PEN") and decimal separators.
 * Only currencies we realistically support are listed here; unknown codes fall
 * back to the user's browser locale.
 */
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  // Latin America
  ARS: "es-AR", // $ (peso argentino)
  BOB: "es-BO", // Bs (boliviano)
  BRL: "pt-BR", // R$ (real brasileño)
  CLP: "es-CL", // $ (peso chileno)
  COP: "es-CO", // $ (peso colombiano)
  CRC: "es-CR", // ₡ (colón costarricense)
  CUP: "es-CU", // $ (peso cubano)
  DOP: "es-DO", // $ (peso dominicano)
  GTQ: "es-GT", // Q (quetzal guatemalteco)
  HNL: "es-HN", // L (lempira hondureño)
  MXN: "es-MX", // $ (peso mexicano)
  NIO: "es-NI", // C$ (córdoba nicaragüense)
  PAB: "es-PA", // B/. (balboa panameño)
  PEN: "es-PE", // S/ (sol peruano)
  PYG: "es-PY", // ₲ (guaraní paraguayo)
  SVC: "es-SV", // ₡ (colón salvadoreño)
  UYU: "es-UY", // $ (peso uruguayo)
  VES: "es-VE", // Bs.S (bolívar venezolano)

  // North America
  USD: "en-US", // $
  CAD: "en-CA", // CA$

  // Europe
  EUR: "de-DE", // €
  GBP: "en-GB", // £
  CHF: "de-CH", // CHF

  // Other common
  JPY: "ja-JP", // ¥
  CNY: "zh-CN", // ¥
  KRW: "ko-KR", // ₩
  INR: "en-IN", // ₹
  AUD: "en-AU", // A$
  NZD: "en-NZ", // NZ$
};

export interface CurrencyFormatOptions {
  /** Show decimal places. Default: true */
  showDecimals?: boolean;
  /** Override the locale used for formatting */
  locale?: string;
}

/**
 * Format a price amount using an ISO 4217 currency code.
 * Automatically places the symbol before or after the number according to the locale.
 *
 * @example
 * formatCurrency(25.5, "PEN")  // "S/ 25.50"
 * formatCurrency(25.5, "EUR")  // "25,50 €"
 * formatCurrency(25.5, "USD")  // "$25.50"
 * formatCurrency(1000, "CLP", { showDecimals: false }) // "$1.000"
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  options: CurrencyFormatOptions = {}
): string {
  const { showDecimals = true, locale } = options;
  const resolvedLocale = locale ?? CURRENCY_LOCALE_MAP[currencyCode] ?? undefined;

  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Extract just the currency symbol for a given ISO 4217 code.
 * Useful when you need to display the symbol separately from the number.
 *
 * @example
 * getCurrencySymbol("PEN") // "S/"
 * getCurrencySymbol("EUR") // "€"
 * getCurrencySymbol("USD") // "$"
 */
export function getCurrencySymbol(currencyCode: string, locale?: string): string {
  const resolvedLocale = locale ?? CURRENCY_LOCALE_MAP[currencyCode] ?? undefined;

  const parts = new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: currencyCode,
  }).formatToParts(0);

  return parts.find((p) => p.type === "currency")?.value ?? currencyCode;
}

/**
 * Returns whether the currency symbol is placed after the number for a given locale.
 *
 * @example
 * isCurrencySymbolSuffix("EUR") // true  → "25,00 €"
 * isCurrencySymbolSuffix("USD") // false → "$25.00"
 */
export function isCurrencySymbolSuffix(currencyCode: string, locale?: string): boolean {
  const resolvedLocale = locale ?? CURRENCY_LOCALE_MAP[currencyCode] ?? undefined;

  const parts = new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: currencyCode,
  }).formatToParts(0);

  const currencyIndex = parts.findIndex((p) => p.type === "currency");
  const integerIndex = parts.findIndex((p) => p.type === "integer");

  return currencyIndex > integerIndex;
}
