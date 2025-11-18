/**
 * Date Locale Hook
 *
 * Custom hook to get the appropriate date-fns locale based on the current i18n locale.
 */

import { useMemo } from "react";
import { useTranslation } from "@/client/i18n";
import { getDateLocale } from "@/client/lib/booking-utils";

/**
 * Get date-fns locale based on current i18n locale
 */
export function useDateLocale() {
  const { locale } = useTranslation();
  return useMemo(() => getDateLocale(locale), [locale]);
}
