import type { INotificationSenderPort } from "../../domain/ports/INotificationSenderPort";
import type { NotificationJobPayload } from "../../domain/types/NotificationJobPayload";
import { NotificationChannel } from "../../domain/types/NotificationChannel";
import { NotificationEvent } from "../../domain/types/NotificationEvent";

const WHATSAPP_TEMPLATE_BY_EVENT: Record<
  NotificationEvent,
  keyof NonNullable<NotificationJobPayload["templates"]["whatsapp"]>
> = {
  [NotificationEvent.APPOINTMENT_CREATED]: "appointmentCreated",
  [NotificationEvent.APPOINTMENT_CONFIRMED]: "appointmentConfirmed",
  [NotificationEvent.APPOINTMENT_COMPLETED]: "appointmentCompleted",
  [NotificationEvent.APPOINTMENT_CANCELLED]: "appointmentCancelled",
};

export class SendAppointmentNotificationUseCase {
  constructor(private readonly senders: INotificationSenderPort[]) {}

  async execute(
    payload: NotificationJobPayload
  ): Promise<PromiseSettledResult<{ success: boolean; error?: string }>[]> {
    const templateData: Record<string, string | number> = {
      customerFirstName: payload.customer.firstName,
      serviceName: payload.service.name,
      startTime: payload.appointment.startTime,
      endTime: payload.appointment.endTime,
      businessName: payload.business.title,
      businessPhone: payload.business.phone,
      ...(payload.appointment.notes ? { notes: payload.appointment.notes } : {}),
    };

    const whatsappTemplateKey = WHATSAPP_TEMPLATE_BY_EVENT[payload.event];

    const tasks = this.senders
      .filter((sender) => payload.channels.includes(sender.channel))
      .map((sender) => {
        if (
          sender.channel === NotificationChannel.EMAIL &&
          payload.customer.email
        ) {
          return sender.send({
            recipientEmail: payload.customer.email,
            recipientName: [
              payload.customer.firstName,
              payload.customer.lastName,
            ]
              .filter(Boolean)
              .join(" "),
            // templateName drives static template resolution — no external ID needed
            templateName: payload.event,
            templateData,
          });
        }

        if (
          sender.channel === NotificationChannel.WHATSAPP &&
          payload.customer.phone
        ) {
          return sender.send({
            recipientPhone: payload.customer.phone,
            recipientName: payload.customer.firstName,
            templateName: payload.event,
            // templateId is the Meta-approved template name for this event
            templateId: payload.templates.whatsapp?.[whatsappTemplateKey],
            templateData,
          });
        }

        return Promise.resolve({ success: true });
      });

    return Promise.allSettled(tasks);
  }
}
