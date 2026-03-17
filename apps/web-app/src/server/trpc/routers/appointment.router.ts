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
import { privateProcedure, publicProcedure } from "../procedures";
import { PrismaAppointmentRepository } from "@/server/infrastructure/repositories/PrismaAppointmentRepository";
import {
  GetCustomerUpcomingAppointmentsUseCase,
  GetCustomerPastAppointmentsUseCase,
  CreateAppointmentUseCase,
  GetBusinessAppointmentsUseCase,
} from "@/server/core/application/use-cases/appointment";

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
        customerId: z.string(), // Can be authenticated user ID or guest user ID
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
  getBusinessAppointments: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid(),
        filters: z
          .object({
            status: z
              .union([
                z.enum(["scheduled", "confirmed", "completed", "cancelled"]),
                z
                  .array(
                    z.enum(["scheduled", "confirmed", "completed", "cancelled"])
                  )
                  .min(1),
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
    .query(async ({ input }) => {
      const appointmentRepository = new PrismaAppointmentRepository();
      const getBusinessAppointmentsUseCase = new GetBusinessAppointmentsUseCase(
        appointmentRepository
      );

      const result = await getBusinessAppointmentsUseCase.execute({
        businessId: input.businessId,
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
});
