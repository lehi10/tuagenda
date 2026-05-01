import type { NotificationChannel } from "../types/NotificationChannel";

export interface SendNotificationRequest {
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  templateName: string;
  templateId?: string | number;  // Brevo: numeric ID, Meta: template name string
  templateData: Record<string, string | number>;
}

export interface SendNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface INotificationSenderPort {
  readonly channel: NotificationChannel;
  send(_request: SendNotificationRequest): Promise<SendNotificationResult>;
}
