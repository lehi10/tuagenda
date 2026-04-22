/**
 * Employee Service Router
 *
 * tRPC router for employee-service assignment operations.
 * All procedures are private (require authentication).
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { privateProcedure, businessMemberProcedure } from "../procedures";
import { PrismaEmployeeServiceRepository } from "@/server/infrastructure/repositories/PrismaEmployeeServiceRepository";
import {
  AssignServiceToEmployeeUseCase,
  UnassignServiceFromEmployeeUseCase,
  GetEmployeeServicesUseCase,
  GetServiceEmployeesUseCase,
  AssignMultipleServicesToEmployeeUseCase,
} from "@/server/core/application/use-cases/employee-service";

export const employeeServiceRouter = router({
  /**
   * Assign a service to an employee (PRIVATE)
   */
  assign: businessMemberProcedure
    .input(
      z.object({
        businessUserId: z
          .string()
          .uuid("Business User ID must be a valid UUID"),
        serviceId: z.string().uuid("Service ID must be a valid UUID"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const repository = new PrismaEmployeeServiceRepository();
      const useCase = new AssignServiceToEmployeeUseCase(repository);
      const result = await useCase.execute({
        ...input,
        businessId: ctx.businessId,
      });

      if (!result.success || !result.employeeService) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to assign service to employee",
        });
      }

      return result.employeeService.toObject();
    }),

  /**
   * Unassign a service from an employee (PRIVATE)
   */
  unassign: privateProcedure
    .input(
      z.object({
        businessUserId: z
          .string()
          .uuid("Business User ID must be a valid UUID"),
        serviceId: z.string().uuid("Service ID must be a valid UUID"),
      })
    )
    .mutation(async ({ input }) => {
      const repository = new PrismaEmployeeServiceRepository();
      const useCase = new UnassignServiceFromEmployeeUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to unassign service from employee",
        });
      }

      return { success: true };
    }),

  /**
   * Assign multiple services to an employee (replaces all existing) (PRIVATE)
   */
  assignMultiple: businessMemberProcedure
    .input(
      z.object({
        businessUserId: z
          .string()
          .uuid("Business User ID must be a valid UUID"),
        serviceIds: z.array(z.string().uuid("Service ID must be a valid UUID")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const repository = new PrismaEmployeeServiceRepository();
      const useCase = new AssignMultipleServicesToEmployeeUseCase(repository);
      const result = await useCase.execute({
        ...input,
        businessId: ctx.businessId,
      });

      if (!result.success || !result.employeeServices) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to assign services to employee",
        });
      }

      return {
        assignments: result.employeeServices.map((es) => es.toObject()),
        count: result.employeeServices.length,
      };
    }),

  /**
   * Get all services assigned to an employee (PRIVATE)
   */
  getByEmployee: privateProcedure
    .input(
      z.object({
        businessUserId: z
          .string()
          .uuid("Business User ID must be a valid UUID"),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaEmployeeServiceRepository();
      const useCase = new GetEmployeeServicesUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch employee services",
        });
      }

      return result.data;
    }),

  /**
   * Get all employees assigned to a service (PRIVATE)
   */
  getByService: privateProcedure
    .input(
      z.object({
        serviceId: z.string().uuid("Service ID must be a valid UUID"),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaEmployeeServiceRepository();
      const useCase = new GetServiceEmployeesUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch service employees",
        });
      }

      return result.data;
    }),
});
