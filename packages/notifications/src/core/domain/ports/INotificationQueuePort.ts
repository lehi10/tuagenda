import type { NotificationJobPayload } from "../types/NotificationJobPayload";

export interface INotificationQueuePort {
  enqueue(_payload: NotificationJobPayload): Promise<void>;
}
