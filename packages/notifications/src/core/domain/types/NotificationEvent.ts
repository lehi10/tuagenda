export const NotificationEvent = {
  APPOINTMENT_CREATED: "appointment.created",
  APPOINTMENT_CANCELLED: "appointment.cancelled",
} as const;

export type NotificationEvent =
  (typeof NotificationEvent)[keyof typeof NotificationEvent];
