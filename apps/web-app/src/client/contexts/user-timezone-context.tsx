"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useAuth } from "./auth-context";
import { getBrowserTimezone } from "@/client/lib/timezone-utils";

const STORAGE_KEY = "tuagenda_tz";

interface UserTimezoneContextValue {
  timezone: string;
  setTimezone: (tz: string) => void;
}

const UserTimezoneContext = createContext<UserTimezoneContextValue | undefined>(
  undefined
);

/**
 * UserTimezoneProvider
 *
 * Provides the user's timezone for booking flow and client-facing screens.
 *
 * Priority:
 * 1. User's saved timezone from their profile (if logged in)
 * 2. Manual override stored in localStorage
 * 3. Browser timezone (Intl.DateTimeFormat)
 *
 * Mount this in (client) layout and (booking) layout.
 */
export function UserTimezoneProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [localOverride, setLocalOverride] = useState<string | null>(null);

  // Load localStorage override on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLocalOverride(stored);
    }
  }, []);

  // Clear local override when user has a profile timezone (profile takes precedence)
  useEffect(() => {
    if (user?.timeZone) {
      setLocalOverride(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user?.timeZone]);

  function setTimezone(tz: string) {
    localStorage.setItem(STORAGE_KEY, tz);
    setLocalOverride(tz);
  }

  const timezone = useMemo(
    () => user?.timeZone ?? localOverride ?? getBrowserTimezone(),
    [user?.timeZone, localOverride]
  );

  return (
    <UserTimezoneContext.Provider value={{ timezone, setTimezone }}>
      {children}
    </UserTimezoneContext.Provider>
  );
}

/**
 * Hook to get and set the user's timezone in booking/client screens.
 *
 * Usage:
 * ```tsx
 * const { timezone, setTimezone } = useUserTimezone();
 * formatInTz(date, timezone, "h:mm a");
 * ```
 */
export function useUserTimezone(): UserTimezoneContextValue {
  const context = useContext(UserTimezoneContext);
  if (context === undefined) {
    throw new Error(
      "useUserTimezone must be used within a UserTimezoneProvider"
    );
  }
  return context;
}
