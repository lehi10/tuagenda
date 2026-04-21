/**
 * Booking Utility Functions
 *
 * Reusable utility functions for the booking flow.
 */

import { es, enUS } from "date-fns/locale";
import type { Locale } from "date-fns";
import type { TimeSlot, PaymentMethod } from "@/client/types/booking";

/**
 * Get user initials from full name
 * @example getInitials("John Doe") => "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Get date-fns locale based on i18n locale
 */
export function getDateLocale(locale: string): Locale {
  return locale === "es" ? es : enUS;
}

/**
 * Format phone number for WhatsApp (remove all non-digits)
 * @example formatPhoneForWhatsApp("+51 999 888 777") => "51999888777"
 */
export function formatPhoneForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Get payment method label from translation object
 */
export function getPaymentMethodLabel(
  method: PaymentMethod,
  labels: Record<string, string>
): string {
  return labels[method] || method;
}

/**
 * Generate time slots for booking
 * @param startHour - Starting hour (default: 9 AM)
 * @param endHour - Ending hour (default: 6 PM)
 * @param intervalMinutes - Interval between slots (default: 30 minutes)
 * @returns Array of time slots
 */
export function generateTimeSlots(
  startHour = 9,
  endHour = 18,
  intervalMinutes = 30
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const baseDate = new Date();
  baseDate.setUTCHours(0, 0, 0, 0);

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = new Date(baseDate);
    startTime.setUTCHours(hour, 0, 0, 0);
    const endTime = new Date(startTime.getTime() + intervalMinutes * 60000);

    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      startTime,
      endTime,
      available: Math.random() > 0.3, // TODO: Replace with actual availability check
    });

    if (intervalMinutes === 30) {
      const halfStart = new Date(baseDate);
      halfStart.setUTCHours(hour, 30, 0, 0);
      const halfEnd = new Date(halfStart.getTime() + intervalMinutes * 60000);

      slots.push({
        time: `${hour.toString().padStart(2, "0")}:30`,
        startTime: halfStart,
        endTime: halfEnd,
        available: Math.random() > 0.3, // TODO: Replace with actual availability check
      });
    }
  }

  return slots;
}

/**
 * Format price with currency symbol
 * @example formatPrice(25.50) => "$25.50"
 */
export function formatPrice(price: number, currency = "$"): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format duration in minutes to human-readable string
 * @example formatDuration(90) => "1h 30m"
 * @example formatDuration(45) => "45m"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (international format)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate password with requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate Google Maps directions URL
 */
export function getGoogleMapsDirectionsUrl(
  address: string,
  lat?: number,
  lng?: number
): string {
  if (lat && lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

/**
 * Generate Google Maps embed URL
 */
export function getGoogleMapsEmbedUrl(
  address: string,
  apiKey?: string
): string {
  if (!apiKey) {
    console.warn("Google Maps API key not provided");
    return "";
  }

  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`;
}
