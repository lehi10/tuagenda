export const NotificationChannel = {
  EMAIL: "email",
  WHATSAPP: "whatsapp",
} as const;

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];
