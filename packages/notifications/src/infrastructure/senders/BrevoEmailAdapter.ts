import type {
  INotificationSenderPort,
  SendNotificationRequest,
  SendNotificationResult,
} from "../../core/domain/ports/INotificationSenderPort";
import { NotificationChannel } from "../../core/domain/types/NotificationChannel";

export class BrevoEmailAdapter implements INotificationSenderPort {
  readonly channel = NotificationChannel.EMAIL;

  async send(request: SendNotificationRequest): Promise<SendNotificationResult> {
    const templateId = request.templateId as number | undefined;

    if (!templateId) {
      return { success: false, error: `No Brevo template ID configured for: ${request.templateName}` };
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME,
          email: process.env.EMAIL_FROM_ADDRESS,
        },
        to: [{ email: request.recipientEmail, name: request.recipientName }],
        templateId,
        params: request.templateData,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { success: false, error: `Brevo ${response.status}: ${body}` };
    }

    const data = (await response.json()) as { messageId?: string };
    return { success: true, messageId: data.messageId };
  }
}
