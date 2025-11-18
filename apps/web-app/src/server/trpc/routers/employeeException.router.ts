import { z } from "zod";
import { router } from "../trpc";
import { privateProcedure } from "../procedures";
import { PrismaEmployeeExceptionRepository } from "@/server/infrastructure/repositories/PrismaEmployeeExceptionRepository";
import { EmployeeException } from "@/server/core/domain/entities";
import { randomUUID } from "crypto";
import { prisma } from "db";

const exceptionRepository = new PrismaEmployeeExceptionRepository(prisma);

export const employeeExceptionRouter = router({
  getByEmployee: privateProcedure
    .input(
      z.object({
        businessUserId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const exceptions = await exceptionRepository.findByEmployee(
        input.businessUserId
      );
      return exceptions.map((e) => e.toObject());
    }),

  getByDateRange: privateProcedure
    .input(
      z.object({
        businessUserId: z.string().uuid(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      const exceptions = await exceptionRepository.findByEmployeeDateRange(
        input.businessUserId,
        input.startDate,
        input.endDate
      );
      return exceptions.map((e) => e.toObject());
    }),

  create: privateProcedure
    .input(
      z.object({
        businessUserId: z.string().uuid(),
        businessId: z.string().uuid(),
        date: z.date(),
        isAllDay: z.boolean(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        isAvailable: z.boolean(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const exception = EmployeeException.create({
        id: randomUUID(),
        businessUserId: input.businessUserId,
        businessId: input.businessId,
        date: input.date,
        isAllDay: input.isAllDay,
        startTime: input.startTime,
        endTime: input.endTime,
        isAvailable: input.isAvailable,
        reason: input.reason,
      });

      const created = await exceptionRepository.create(exception);
      return created.toObject();
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        date: z.date().optional(),
        isAllDay: z.boolean().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        isAvailable: z.boolean().optional(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await exceptionRepository.findById(input.id);
      if (!existing) {
        throw new Error("Exception not found");
      }

      if (input.date) {
        existing.updateDate(input.date);
      }

      if (input.isAllDay !== undefined) {
        if (input.isAllDay) {
          existing.makeAllDay();
        } else if (input.startTime && input.endTime) {
          existing.updateTime(input.startTime, input.endTime);
        }
      } else if (input.startTime && input.endTime) {
        existing.updateTime(input.startTime, input.endTime);
      }

      if (input.isAvailable !== undefined) {
        existing.updateAvailability(input.isAvailable);
      }

      if (input.reason !== undefined) {
        existing.updateReason(input.reason);
      }

      const updated = await exceptionRepository.update(existing);
      return updated.toObject();
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      await exceptionRepository.delete(input.id);
    }),
});
