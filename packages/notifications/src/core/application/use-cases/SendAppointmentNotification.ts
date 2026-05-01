import type { INotificationSenderPort } from "../../domain/ports/INotificationSenderPort";
import type { NotificationJobPayload } from "../../domain/types/NotificationJobPayload";
import { NotificationChannel } from "../../domain/types/NotificationChannel";
import { NotificationEvent } from "../../domain/types/NotificationEvent";

export class SendAppointmentNotificationUseCase {
  constructor(private readonly senders: INotificationSenderPort[]) {}

  async execute(payload: NotificationJobPayload): Promise<void> {
    const isCreated = payload.event === NotificationEvent.APPOINTMENT_CREATED;
    const templateData = {
      customerFirstName: payload.customer.firstName,
      serviceName: payload.service.name,
      startTime: payload.appointment.startTime,
      businessName: payload.business.title,
      businessPhone: payload.business.phone,
    };

    const tasks = this.senders
      .filter((sender) => payload.channels.includes(sender.channel))
      .map((sender) => {
        if (sender.channel === NotificationChannel.EMAIL && payload.customer.email) {
          return sender.send({
            recipientEmail: payload.customer.email,
            recipientName: [payload.customer.firstName, payload.customer.lastName]
              .filter(Boolean)
              .join(" "),
            templateName: payload.event,
            templateId: isCreated
              ? payload.templates.email?.appointmentCreated
              : payload.templates.email?.appointmentCancelled,
            templateData,
          });
        }

        if (sender.channel === NotificationChannel.WHATSAPP && payload.customer.phone) {
          return sender.send({
            recipientPhone: payload.customer.phone,
            recipientName: payload.customer.firstName,
            templateName: payload.event,
            templateId: isCreated
              ? payload.templates.whatsapp?.appointmentCreated
              : payload.templates.whatsapp?.appointmentCancelled,
            templateData,
          });
        }

        return Promise.resolve({ success: true });
      });

    await Promise.allSettled(tasks);
  }
}
