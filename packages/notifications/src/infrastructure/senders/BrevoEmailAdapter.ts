import type {
  INotificationSenderPort,
  SendNotificationRequest,
  SendNotificationResult,
} from "../../core/domain/ports/INotificationSenderPort";
import type { IEmailTemplatePort } from "../../core/domain/ports/IEmailTemplatePort";
import { NotificationChannel } from "../../core/domain/types/NotificationChannel";

export class BrevoEmailAdapter implements INotificationSenderPort {
  readonly channel = NotificationChannel.EMAIL;

  constructor(private readonly templates: IEmailTemplatePort) {}

  async send(request: SendNotificationRequest): Promise<SendNotificationResult> {
    const rendered = this.templates.render(request.templateName, request.templateData);

    if (!rendered) {
      return {
        success: false,
        error: `No email template found for: ${request.templateName}`,
      };
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
        subject: rendered.subject,
        htmlContent: rendered.html,
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
