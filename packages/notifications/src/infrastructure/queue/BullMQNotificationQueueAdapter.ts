import { Queue } from "bullmq";
import type { INotificationQueuePort } from "../../core/domain/ports/INotificationQueuePort";
import type { NotificationJobPayload } from "../../core/domain/types/NotificationJobPayload";

const QUEUE_NAME = "notifications";

export class BullMQNotificationQueueAdapter implements INotificationQueuePort {
  async enqueue(payload: NotificationJobPayload): Promise<void> {
    const queue = new Queue(QUEUE_NAME, {
      connection: { url: process.env.REDIS_URL },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });

    try {
      await queue.add(payload.event, payload);
    } finally {
      await queue.close();
    }
  }
}
