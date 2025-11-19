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
import { privateProcedure } from "../procedures";
import { PrismaAppointmentRepository } from "@/server/infrastructure/repositories/PrismaAppointmentRepository";
import {
  GetCustomerUpcomingAppointmentsUseCase,
  GetCustomerPastAppointmentsUseCase,
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
});
