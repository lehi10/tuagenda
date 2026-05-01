import type { INotificationQueuePort } from "../../domain/ports/INotificationQueuePort";
import type { NotificationJobPayload, NotificationTemplates } from "../../domain/types/NotificationJobPayload";
import type { NotificationEvent } from "../../domain/types/NotificationEvent";
import type { NotificationChannel } from "../../domain/types/NotificationChannel";

export interface BusinessNotificationSettings {
  channels?: NotificationChannel[];
  templates?: NotificationTemplates;
}

export interface AppointmentData {
  id: string;
  businessId: string;
  startTime: Date;
  endTime: Date;
  notes: string | null;
  customer?: {
    firstName: string;
    lastName?: string | null;
    email: string;
    phone?: string | null;
  } | null;
  service?: {
    name: string;
    durationMinutes: number;
    price: number;
  } | null;
  business?: {
    title: string;
    phone?: string | null;
    email?: string | null;
    currency?: string | null;
    notificationSettings?: BusinessNotificationSettings | null;
  } | null;
}

export interface EnqueueAppointmentNotificationInput {
  event: NotificationEvent;
  appointment: AppointmentData;
}

export interface EnqueueAppointmentNotificationResult {
  success: boolean;
  error?: string;
}

export class EnqueueAppointmentNotificationUseCase {
  constructor(private readonly queue: INotificationQueuePort) {}

  async execute(
    input: EnqueueAppointmentNotificationInput
  ): Promise<EnqueueAppointmentNotificationResult> {
    try {
      const { appointment, event } = input;

      const settings = appointment.business?.notificationSettings;
      const channels: NotificationChannel[] = settings?.channels ?? [];

      if (channels.length === 0) {
        return { success: true };
      }

      if (!appointment.customer?.email && !appointment.customer?.phone) {
        return { success: true };
      }

      const payload: NotificationJobPayload = {
        event,
        appointmentId: appointment.id,
        businessId: appointment.businessId,
        channels,
        templates: settings?.templates ?? {},
        customer: {
          firstName: appointment.customer.firstName,
          lastName: appointment.customer.lastName ?? null,
          email: appointment.customer.email,
          phone: appointment.customer.phone ?? null,
        },
        service: {
          name: appointment.service?.name ?? "",
          durationMinutes: appointment.service?.durationMinutes ?? 0,
          price: appointment.service?.price ?? 0,
        },
        business: {
          title: appointment.business?.title ?? "",
          phone: appointment.business?.phone ?? "",
          email: appointment.business?.email ?? "",
          currency: appointment.business?.currency ?? "USD",
        },
        appointment: {
          startTime: appointment.startTime.toISOString(),
          endTime: appointment.endTime.toISOString(),
          notes: appointment.notes,
        },
      };

      await this.queue.enqueue(payload);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to enqueue notification",
      };
    }
  }
}
