/**
 * Booking Flow Type Definitions
 *
 * Centralized type definitions for the booking flow.
 * These types are shared across all booking-related components.
 */

/**
 * Service information for booking
 */
export interface Service {
  id: string;
  businessId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simplified service for booking selection
 */
export interface BookingService {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  categoryId: string | null;
}

/**
 * Service category information
 */
export interface ServiceCategory {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Professional/Employee information for booking
 */
export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
  available: boolean;
}

/**
 * Simplified professional for booking selection
 */
export interface BookingProfessional {
  id: string;
  name: string;
}

/**
 * Time slot availability — matches the server TimeSlot shape (via superjson)
 */
export interface TimeSlot {
  time: string;      // "HH:mm" for display
  startTime: Date;   // UTC Date — use this when sending to backend
  endTime: Date;     // UTC Date — use this when sending to backend
  available: boolean;
}

/**
 * Client information for booking
 */
export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  createAccount: boolean;
  userId?: string; // User ID for guest or authenticated users
}

/**
 * Payment method types
 */
export type PaymentMethod = "card" | "onsite" | "digital-wallet";

/**
 * Business location information
 */
export interface BusinessLocation {
  address: string;
  lat?: number;
  lng?: number;
}

/**
 * Complete booking data state
 */
export interface BookingData {
  service?: BookingService;
  professional?: BookingProfessional;
  date?: Date;
  timeSlot?: string;      // "HH:mm" for display only
  slotStartTime?: Date;   // UTC — used when creating the appointment
  slotEndTime?: Date;     // UTC — used when creating the appointment
  clientInfo?: ClientInfo;
  paymentMethod?: PaymentMethod;
}

/**
 * Complete booking summary for confirmation
 * All fields are required at this stage
 */
export interface BookingSummary {
  service: {
    name: string;
    durationMinutes: number;
    price: number;
  };
  professional?: {
    name: string;
  };
  date: Date;
  timeSlot: string;
  clientInfo: ClientInfo;
  paymentMethod: PaymentMethod;
  businessLocation?: BusinessLocation;
}

/**
 * Re-export types from booking-steps for convenience
 */
export type { StepType, StepConfig } from "@/client/lib/booking-steps";
