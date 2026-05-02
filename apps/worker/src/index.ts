import { Worker } from "bullmq";
import {
  SendAppointmentNotificationUseCase,
  type NotificationJobPayload,
} from "notifications";
import {
  BrevoEmailAdapter,
  MetaWhatsAppAdapter,
  StaticEmailTemplateAdapter,
} from "notifications/infrastructure";

const QUEUE_NAME = "notifications";

const emailTemplates = new StaticEmailTemplateAdapter();
const senders = [
  new BrevoEmailAdapter(emailTemplates),
  new MetaWhatsAppAdapter(),
];
const sendNotificationUseCase = new SendAppointmentNotificationUseCase(senders);

const worker = new Worker<NotificationJobPayload>(
  QUEUE_NAME,
  async (job) => {
    console.log(`[worker] Processing job ${job.id}: ${job.name}`);
    await sendNotificationUseCase.execute(job.data);
    console.log(`[worker] Completed job ${job.id}`);
  },
  {
    connection: { url: process.env.REDIS_URL },
    concurrency: 5,
  }
);

worker.on("failed", (job, error) => {
  console.error(`[worker] Job ${job?.id} failed:`, error.message);
});

worker.on("error", (error) => {
  console.error("[worker] Worker error:", error);
});

console.log(`[worker] Started. Listening on queue: ${QUEUE_NAME}`);
