/**
 * Appointment Router
 *
 * tRPC router for appointment-related operations.
 * Handles customer appointment queries.
 *
 * Private procedures: getUpcomingAppointments, getPastAppointments
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import {
  privateProcedure,
  publicProcedure,
  businessMemberProcedure,
} from "../procedures";
import { PrismaAppointmentRepository } from "@/server/infrastructure/repositories/PrismaAppointmentRepository";
import {
  GetCustomerUpcomingAppointmentsUseCase,
  GetCustomerPastAppointmentsUseCase,
  CreateAppointmentUseCase,
  GetBusinessAppointmentsUseCase,
  UpdateAppointmentStatusUseCase,
} from "@/server/core/application/use-cases/appointment";
import { APPOINTMENT_STATUSES, AppointmentStatus } from "@/server/core/domain/entities/Appointment";
import {
  EnqueueAppointmentNotificationUseCase,
  NotificationEvent,
} from "notifications";
import { BullMQNotificationQueueAdapter } from "notifications/infrastructure";
import { logger } from "@/server/lib/logger";

const STATUS_TO_NOTIFICATION_EVENT: Partial<Record<AppointmentStatus, NotificationEvent>> = {
  confirmed: NotificationEvent.APPOINTMENT_CONFIRMED,
  completed: NotificationEvent.APPOINTMENT_COMPLETED,
  cancelled: NotificationEvent.APPOINTMENT_CANCELLED,
  // "scheduled" only fires on create (APPOINTMENT_CREATED), not on status update
};

export const appointmentRouter = router({
  /**
   * Get upcoming appointments for the current customer (PRIVATE)
   * Returns appointments ordered from closest to farthest
   */
  getUpcomingAppointments: privateProcedure
    .input(
      z
        .object({
          businessId: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const customerId = ctx.userId;

      if (!customerId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be authenticated",
        });
      }

      const appointmentRepository = new PrismaAppointmentRepository();
      const getUpcomingAppointmentsUseCase =
        new GetCustomerUpcomingAppointmentsUseCase(appointmentRepository);

      const result = await getUpcomingAppointmentsUseCase.execute({
        customerId,
        businessId: input?.businessId,
      });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch upcoming appointments",
        });
      }

      return result.appointments || [];
    }),

  /**
   * Get past appointments for the current customer (PRIVATE)
   * Returns appointments ordered from most recent to oldest
   */
  getPastAppointments: privateProcedure
    .input(
      z
        .object({
          businessId: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const customerId = ctx.userId;

      if (!customerId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be authenticated",
        });
      }

      const appointmentRepository = new PrismaAppointmentRepository();
      const getPastAppointmentsUseCase = new GetCustomerPastAppointmentsUseCase(
        appointmentRepository
      );

      const result = await getPastAppointmentsUseCase.execute({
        customerId,
        businessId: input?.businessId,
      });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch past appointments",
        });
      }

      return result.appointments || [];
    }),

  /**
   * Create a new appointment (PUBLIC)
   * This allows both authenticated and guest users to book appointments
   */
  create: publicProcedure
    .input(
      z.object({
        customerId: z.string(), // Required: guest or authenticated user ID — always created before reaching this step
        businessId: z.string().uuid(),
        serviceId: z.string().uuid(),
        providerBusinessUserId: z.string().uuid().nullable().optional(),
        startTime: z.string().datetime(), // ISO string
        endTime: z.string().datetime(), // ISO string
        notes: z.string().nullable().optional(),
        isGroup: z.boolean().optional(),
        capacity: z.number().int().positive().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const appointmentRepository = new PrismaAppointmentRepository();
      const createAppointmentUseCase = new CreateAppointmentUseCase(
        appointmentRepository
      );

      try {
        const appointment = await createAppointmentUseCase.execute({
          customerId: input.customerId,
          businessId: input.businessId,
          serviceId: input.serviceId,
          providerBusinessUserId: input.providerBusinessUserId || null,
          startTime: new Date(input.startTime),
          endTime: new Date(input.endTime),
          notes: input.notes || null,
          isGroup: input.isGroup || false,
          capacity: input.capacity || null,
        });

        // fire-and-forget — nunca falla la cita si Redis falla
        try {
          const queueAdapter = new BullMQNotificationQueueAdapter();
          const enqueueUseCase = new EnqueueAppointmentNotificationUseCase(
            queueAdapter
          );
          await enqueueUseCase.execute({
            event: NotificationEvent.APPOINTMENT_CREATED,
            appointment,
          });
        } catch (err) {
          logger.error("EnqueueNotification", "system", `Failed to enqueue appointment.created: ${err instanceof Error ? err.message : String(err)}`);
        }

        return { appointment };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create appointment",
        });
      }
    }),

  /**
   * Get all appointments for a business (PRIVATE)
   * Returns paginated appointments with filters
   */
  getBusinessAppointments: businessMemberProcedure
    .input(
      z.object({
        filters: z
          .object({
            status: z
              .union([
                z.enum(APPOINTMENT_STATUSES),
                z.array(z.enum(APPOINTMENT_STATUSES)).min(1),
              ])
              .optional(),
            providerBusinessUserId: z.string().uuid().optional(),
            serviceId: z.string().uuid().optional(),
            startAfter: z.string().datetime().optional(),
            startBefore: z.string().datetime().optional(),
          })
          .optional(),
        pagination: z
          .object({
            limit: z.number().int().positive().max(100).default(10),
            offset: z.number().int().nonnegative().default(0),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const appointmentRepository = new PrismaAppointmentRepository();
      const getBusinessAppointmentsUseCase = new GetBusinessAppointmentsUseCase(
        appointmentRepository
      );

      const result = await getBusinessAppointmentsUseCase.execute({
        businessId: ctx.businessId,
        filters: input.filters
          ? {
              ...input.filters,
              startAfter: input.filters.startAfter
                ? new Date(input.filters.startAfter)
                : undefined,
              startBefore: input.filters.startBefore
                ? new Date(input.filters.startBefore)
                : undefined,
            }
          : undefined,
        pagination: input.pagination,
      });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch business appointments",
        });
      }

      return {
        appointments: result.appointments || [],
        total: result.total || 0,
      };
    }),

  /**
   * Update appointment status (PRIVATE)
   * Validates allowed transitions before updating
   */
  updateStatus: businessMemberProcedure
    .input(
      z.object({
        appointmentId: z.string().uuid(),
        status: z.enum(["scheduled", "confirmed", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const appointmentRepository = new PrismaAppointmentRepository();
      const updateStatusUseCase = new UpdateAppointmentStatusUseCase(
        appointmentRepository
      );

      const result = await updateStatusUseCase.execute({
        appointmentId: input.appointmentId,
        businessId: ctx.businessId,
        status: input.status,
      });

      if (!result.success || !result.appointment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to update appointment status",
        });
      }

      // fire-and-forget — el cambio de estado nunca falla por Redis
      const notificationEvent = STATUS_TO_NOTIFICATION_EVENT[input.status];
      if (notificationEvent) {
        try {
          const queueAdapter = new BullMQNotificationQueueAdapter();
          const enqueueUseCase = new EnqueueAppointmentNotificationUseCase(queueAdapter);
          await enqueueUseCase.execute({
            event: notificationEvent,
            appointment: result.appointment,
          });
        } catch (err) {
          logger.error("EnqueueNotification", "system", `Failed to enqueue ${notificationEvent}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      return { appointment: result.appointment };
    }),
});
