/**
 * Appointment Domain Entity
 *
 * This represents the core business entity for appointments in the domain layer.
 * It is independent of any infrastructure concerns.
 *
 * @module core/domain/entities
 */

export const APPOINTMENT_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface Appointment {
  id?: string;
  customerId?: string | null;
  providerBusinessUserId?: string | null;
  businessId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  isGroup: boolean;
  capacity?: number | null;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  // Joined data (optional, for queries with includes)
  customer?: {
    id: string;
    firstName: string;
    lastName?: string | null;
    email: string;
    phone?: string | null;
  } | null;

  providerBusinessUser?: {
    id: string;
    displayName?: string | null;
    user: {
      id: string;
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      pictureFullPath?: string | null;
    };
  } | null;

  service?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationMinutes: number;
    category?: { id: string; name: string } | null;
  };

  business?: {
    id: string;
    title: string;
    slug: string;
    logo?: string | null;
    coverImage?: string | null;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    website?: string | null;
    currency?: string;
    notificationSettings?:
      | import("notifications").BusinessNotificationSettings
      | null;
  };
}
