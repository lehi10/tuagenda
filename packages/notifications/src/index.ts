// Ports
export type { INotificationQueuePort } from "./core/domain/ports/INotificationQueuePort";
export type {
  INotificationSenderPort,
  SendNotificationRequest,
  SendNotificationResult,
} from "./core/domain/ports/INotificationSenderPort";
export type {
  IEmailTemplatePort,
  RenderedEmail,
} from "./core/domain/ports/IEmailTemplatePort";

// Types
export { NotificationChannel } from "./core/domain/types/NotificationChannel";
export type { NotificationChannel as NotificationChannelType } from "./core/domain/types/NotificationChannel";
export { NotificationEvent } from "./core/domain/types/NotificationEvent";
export type { NotificationEvent as NotificationEventType } from "./core/domain/types/NotificationEvent";
export type { NotificationJobPayload } from "./core/domain/types/NotificationJobPayload";

// Use cases
export {
  EnqueueAppointmentNotificationUseCase,
} from "./core/application/use-cases/EnqueueAppointmentNotification";
export type {
  EnqueueAppointmentNotificationInput,
  EnqueueAppointmentNotificationResult,
  AppointmentData,
  BusinessNotificationSettings,
} from "./core/application/use-cases/EnqueueAppointmentNotification";
export type { NotificationTemplates } from "./core/domain/types/NotificationJobPayload";
export { SendAppointmentNotificationUseCase } from "./core/application/use-cases/SendAppointmentNotification";
