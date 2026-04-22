import { z } from "zod";
import { router } from "../trpc";
import { privateProcedure, businessMemberProcedure } from "../procedures";
import { PrismaEmployeeAvailabilityRepository } from "@/server/infrastructure/repositories/PrismaEmployeeAvailabilityRepository";
import { EmployeeAvailability } from "@/server/core/domain/entities";
import { randomUUID } from "crypto";

export const employeeAvailabilityRouter = router({
  getByEmployee: privateProcedure
    .input(
      z.object({
        businessUserId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const availabilityRepository = new PrismaEmployeeAvailabilityRepository();
      const availabilities = await availabilityRepository.findByEmployee(
        input.businessUserId
      );
      return availabilities.map((a) => a.toObject());
    }),

  create: businessMemberProcedure
    .input(
      z.object({
        businessUserId: z.string().uuid(),
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.date(),
        endTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const availabilityRepository = new PrismaEmployeeAvailabilityRepository();
      const availability = EmployeeAvailability.create({
        id: randomUUID(),
        businessUserId: input.businessUserId,
        businessId: ctx.businessId,
        dayOfWeek: input.dayOfWeek,
        startTime: input.startTime,
        endTime: input.endTime,
      });

      const created = await availabilityRepository.create(availability);
      return created.toObject();
    }),

  update: businessMemberProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        dayOfWeek: z.number().int().min(0).max(6).optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const availabilityRepository = new PrismaEmployeeAvailabilityRepository();
      const existing = await availabilityRepository.findById(input.id);
      if (!existing) {
        throw new Error("Availability not found");
      }

      if (input.dayOfWeek !== undefined) {
        existing.updateDayOfWeek(input.dayOfWeek);
      }

      if (input.startTime && input.endTime) {
        existing.updateTime(input.startTime, input.endTime);
      }

      const updated = await availabilityRepository.update(existing);
      return updated.toObject();
    }),

  delete: businessMemberProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const availabilityRepository = new PrismaEmployeeAvailabilityRepository();
      await availabilityRepository.delete(input.id);
    }),

  setEmployeeAvailability: businessMemberProcedure
    .input(
      z.object({
        businessUserId: z.string().uuid(),
        availabilities: z.array(
          z.object({
            dayOfWeek: z.number().int().min(0).max(6),
            startTime: z.date(),
            endTime: z.date(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const availabilityRepository = new PrismaEmployeeAvailabilityRepository();
      const availabilityEntities = input.availabilities.map((a) =>
        EmployeeAvailability.create({
          id: randomUUID(),
          businessUserId: input.businessUserId,
          businessId: ctx.businessId,
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
        })
      );

      const created = await availabilityRepository.setEmployeeAvailability(
        input.businessUserId,
        ctx.businessId,
        availabilityEntities
      );

      return created.map((a) => a.toObject());
    }),
});
