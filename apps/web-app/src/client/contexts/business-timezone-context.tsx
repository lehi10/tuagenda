"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useBusiness } from "./business-context";

interface BusinessTimezoneContextValue {
  timezone: string;
}

const BusinessTimezoneContext = createContext<
  BusinessTimezoneContextValue | undefined
>(undefined);

/**
 * BusinessTimezoneProvider
 *
 * Provides the current business timezone to admin screens.
 * Derives the timezone from BusinessContext — no extra fetching needed.
 * Mount this inside (private) layout, after BusinessProvider.
 */
export function BusinessTimezoneProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentBusiness } = useBusiness();

  const value = useMemo(
    () => ({ timezone: currentBusiness?.timeZone ?? "UTC" }),
    [currentBusiness?.timeZone]
  );

  return (
    <BusinessTimezoneContext.Provider value={value}>
      {children}
    </BusinessTimezoneContext.Provider>
  );
}

/**
 * Hook to get the current business timezone in admin screens.
 *
 * Usage:
 * ```tsx
 * const { timezone } = useBusinessTimezone();
 * formatInTz(date, timezone, "h:mm a");
 * ```
 */
export function useBusinessTimezone(): BusinessTimezoneContextValue {
  const context = useContext(BusinessTimezoneContext);
  if (context === undefined) {
    throw new Error(
      "useBusinessTimezone must be used within a BusinessTimezoneProvider"
    );
  }
  return context;
}
