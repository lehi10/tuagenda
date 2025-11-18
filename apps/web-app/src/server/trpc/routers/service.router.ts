/**
 * Service Router
 *
 * tRPC router for service operations.
 * All procedures are private (require authentication).
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { privateProcedure, publicProcedure } from "../procedures";
import { PrismaServiceRepository } from "@/server/infrastructure/repositories/PrismaServiceRepository";
import {
  CreateServiceUseCase,
  GetServiceUseCase,
  ListServicesUseCase,
  UpdateServiceUseCase,
  DeleteServiceUseCase,
} from "@/server/core/application/use-cases/service";

export const serviceRouter = router({
  /**
   * List active services for a business (PUBLIC)
   * Returns only active services for public booking flow
   */
  listPublic: publicProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        categoryId: z.string().uuid().optional().nullable(),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaServiceRepository();
      const useCase = new ListServicesUseCase(repository);
      const result = await useCase.execute({
        businessId: input.businessId,
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        active: true, // Only return active services for public
      });

      if (!result.success || !result.services) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch services",
        });
      }

      return {
        services: result.services.map((s) => {
          const serviceObj = s.toObject();
          return {
            ...serviceObj,
            price: serviceObj.price.toNumber(),
          };
        }),
        total: result.total || 0,
      };
    }),

  /**
   * Get a service by ID (PRIVATE)
   */
  getById: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Service ID must be a valid UUID"),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaServiceRepository();
      const useCase = new GetServiceUseCase(repository);
      const result = await useCase.execute({ id: input.id });

      if (!result.success || !result.service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: result.error || "Service not found",
        });
      }

      const serviceObj = result.service.toObject();
      return {
        ...serviceObj,
        price: serviceObj.price.toNumber(),
      };
    }),

  /**
   * List services for a business (PRIVATE)
   */
  list: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        categoryId: z.string().uuid().optional().nullable(),
        active: z.boolean().optional(),
        search: z.string().optional(),
        minPrice: z.number().nonnegative().optional(),
        maxPrice: z.number().nonnegative().optional(),
        minDuration: z.number().int().positive().optional(),
        maxDuration: z.number().int().positive().optional(),
        limit: z.number().int().positive().optional(),
        offset: z.number().int().nonnegative().optional(),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaServiceRepository();
      const useCase = new ListServicesUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.services) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch services",
        });
      }

      return {
        services: result.services.map((s) => {
          const serviceObj = s.toObject();
          return {
            ...serviceObj,
            price: serviceObj.price.toNumber(),
          };
        }),
        total: result.total || 0,
      };
    }),

  /**
   * Create a new service (PRIVATE)
   */
  create: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        categoryId: z.string().uuid().optional().nullable(),
        name: z.string().min(1, "Name is required").max(255),
        description: z.string().optional().nullable(),
        price: z.number().nonnegative("Price cannot be negative"),
        durationMinutes: z
          .number()
          .int()
          .positive("Duration must be positive")
          .max(1440, "Duration cannot exceed 24 hours"),
        active: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const repository = new PrismaServiceRepository();
      const useCase = new CreateServiceUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.service) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to create service",
        });
      }

      const serviceObj = result.service.toObject();
      return {
        ...serviceObj,
        price: serviceObj.price.toNumber(),
      };
    }),

  /**
   * Update an existing service (PRIVATE)
   */
  update: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Service ID must be a valid UUID"),
        categoryId: z.string().uuid().optional().nullable(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional().nullable(),
        price: z.number().nonnegative().optional(),
        durationMinutes: z.number().int().positive().max(1440).optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const repository = new PrismaServiceRepository();
      const useCase = new UpdateServiceUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.service) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to update service",
        });
      }

      const serviceObj = result.service.toObject();
      return {
        ...serviceObj,
        price: serviceObj.price.toNumber(),
      };
    }),

  /**
   * Delete a service (PRIVATE)
   */
  delete: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Service ID must be a valid UUID"),
      })
    )
    .mutation(async ({ input }) => {
      const repository = new PrismaServiceRepository();
      const useCase = new DeleteServiceUseCase(repository);
      const result = await useCase.execute({ id: input.id });

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to delete service",
        });
      }

      return { success: true };
    }),
});
