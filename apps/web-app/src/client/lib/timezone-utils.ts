import { format, fromZonedTime, toZonedTime } from "date-fns-tz";
export { fromZonedTime, toZonedTime };

export const SUPPORTED_TIMEZONES: { value: string; label: string }[] = [
  // México
  { value: "America/Mexico_City", label: "CST — Ciudad de México" },
  { value: "America/Monterrey", label: "CST — Monterrey" },
  { value: "America/Tijuana", label: "PST — Tijuana" },
  // América Central
  { value: "America/Guatemala", label: "CST — Guatemala" },
  { value: "America/Managua", label: "CST — Managua" },
  { value: "America/Costa_Rica", label: "CST — San José" },
  { value: "America/Panama", label: "EST — Panamá" },
  // Caribe
  { value: "America/Santo_Domingo", label: "AST — Santo Domingo" },
  { value: "America/Havana", label: "CST — La Habana" },
  { value: "America/Puerto_Rico", label: "AST — San Juan" },
  // Sudamérica
  { value: "America/Bogota", label: "COT — Bogotá" },
  { value: "America/Lima", label: "PET — Lima" },
  { value: "America/Guayaquil", label: "ECT — Quito" },
  { value: "America/Caracas", label: "VET — Caracas" },
  { value: "America/La_Paz", label: "BOT — La Paz" },
  { value: "America/Asuncion", label: "PYT — Asunción" },
  { value: "America/Santiago", label: "CLT — Santiago" },
  { value: "America/Argentina/Buenos_Aires", label: "ART — Buenos Aires" },
  { value: "America/Montevideo", label: "UYT — Montevideo" },
  { value: "America/Sao_Paulo", label: "BRT — São Paulo" },
  { value: "America/Manaus", label: "AMT — Manaos" },
  // España
  { value: "Europe/Madrid", label: "CET — Madrid" },
];

/**
 * Returns the browser's local IANA timezone identifier.
 * Falls back to "UTC" if the browser doesn't support it.
 */
export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/**
 * Formats a UTC Date in a specific timezone using a date-fns format string.
 *
 * @param date - UTC Date object (as returned from the server via superjson)
 * @param tz - IANA timezone string (e.g. "America/Bogota")
 * @param formatStr - date-fns format string (e.g. "yyyy-MM-dd", "h:mm a")
 */
export function formatInTz(date: Date, tz: string, formatStr: string): string {
  return format(toZonedTime(date, tz), formatStr, { timeZone: tz });
}

/**
 * Converts a slot time string ("HH:mm") interpreted in a business timezone,
 * combined with a base date, into a UTC Date for sending to the backend.
 *
 * @param baseDate - The selected date (any time component is ignored)
 * @param slotTime - Time string in "HH:mm" format, interpreted as businessTz local time
 * @param businessTz - IANA timezone of the business (e.g. "America/Bogota")
 */
/**
 * Returns the UTC Date representing the start of a given day in a specific timezone.
 * Use this to build UTC-correct filter ranges from business-timezone "day" boundaries.
 */
export function startOfDayInTz(date: Date, tz: string): Date {
  const zoned = toZonedTime(date, tz);
  zoned.setHours(0, 0, 0, 0);
  return fromZonedTime(zoned, tz);
}

/**
 * Returns the UTC Date representing the end of a given day in a specific timezone.
 */
export function endOfDayInTz(date: Date, tz: string): Date {
  const zoned = toZonedTime(date, tz);
  zoned.setHours(23, 59, 59, 999);
  return fromZonedTime(zoned, tz);
}

export function slotToUtcDate(
  baseDate: Date,
  slotTime: string,
  businessTz: string
): Date {
  const [hoursStr, minutesStr] = slotTime.split(":");
  const hours = parseInt(hoursStr ?? "0", 10);
  const minutes = parseInt(minutesStr ?? "0", 10);

  const zonedDate = toZonedTime(baseDate, businessTz);
  zonedDate.setHours(hours, minutes, 0, 0);

  return fromZonedTime(zonedDate, businessTz);
}
