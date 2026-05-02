import type { NotificationChannel } from "./NotificationChannel";
import type { NotificationEvent } from "./NotificationEvent";

export interface NotificationTemplates {
  email?: {
    appointmentCreated?: number;
    appointmentCancelled?: number;
  };
  whatsapp?: {
    appointmentCreated?: string;
    appointmentCancelled?: string;
  };
}

export interface NotificationJobPayload {
  event: NotificationEvent;
  appointmentId: string;
  businessId: string;
  channels: NotificationChannel[];
  templates: NotificationTemplates;
  customer: {
    firstName: string;
    lastName: string | null;
    email: string;
    phone: string | null;
  };
  service: {
    name: string;
    durationMinutes: number;
    price: number;
  };
  business: {
    title: string;
    phone: string;
    email: string;
    currency: string;
  };
  appointment: {
    startTime: string;
    endTime: string;
    notes: string | null;
  };
}
