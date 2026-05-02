export const NotificationEvent = {
  APPOINTMENT_CREATED: "appointment.created",
  APPOINTMENT_CONFIRMED: "appointment.confirmed",
  APPOINTMENT_COMPLETED: "appointment.completed",
  APPOINTMENT_CANCELLED: "appointment.cancelled",
} as const;

export type NotificationEvent =
  (typeof NotificationEvent)[keyof typeof NotificationEvent];
