import type {
  INotificationSenderPort,
  SendNotificationRequest,
  SendNotificationResult,
} from "../../core/domain/ports/INotificationSenderPort";
import { NotificationChannel } from "../../core/domain/types/NotificationChannel";

export class MetaWhatsAppAdapter implements INotificationSenderPort {
  readonly channel = NotificationChannel.WHATSAPP;

  async send(request: SendNotificationRequest): Promise<SendNotificationResult> {
    const templateName = request.templateId as string | undefined;

    if (!templateName) {
      return { success: false, error: `No Meta template name configured for: ${request.templateName}` };
    }
    const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: request.recipientPhone,
        type: "template",
        template: {
          name: templateName,
          language: { code: "es" },
          components: [
            {
              type: "body",
              parameters: Object.values(request.templateData).map((value) => ({
                type: "text",
                text: String(value),
              })),
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { success: false, error: `Meta WA ${response.status}: ${body}` };
    }

    const data = (await response.json()) as { messages?: Array<{ id: string }> };
    return { success: true, messageId: data.messages?.[0]?.id };
  }
}
