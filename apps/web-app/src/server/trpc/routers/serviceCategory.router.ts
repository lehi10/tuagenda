/**
 * ServiceCategory Router
 *
 * tRPC router for service category operations.
 * All procedures are private (require authentication).
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { privateProcedure, publicProcedure } from "../procedures";
import { PrismaServiceCategoryRepository } from "@/server/infrastructure/repositories/PrismaServiceCategoryRepository";
import {
  CreateServiceCategoryUseCase,
  GetServiceCategoryUseCase,
  ListServiceCategoriesUseCase,
  UpdateServiceCategoryUseCase,
  DeleteServiceCategoryUseCase,
} from "@/server/core/application/use-cases/service-category";

export const serviceCategoryRouter = router({
  /**
   * List service categories for a business (PUBLIC)
   * Returns all categories for public booking flow
   */
  listPublic: publicProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaServiceCategoryRepository();
      const useCase = new ListServiceCategoriesUseCase(repository);
      const result = await useCase.execute({ businessId: input.businessId });

      if (!result.success || !result.categories) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch service categories",
        });
      }

      return {
        categories: result.categories.map((c) => c.toObject()),
        total: result.total || 0,
      };
    }),

  /**
   * Get a service category by ID (PRIVATE)
   */
  getById: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Service category ID must be a valid UUID"),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaServiceCategoryRepository();
      const useCase = new GetServiceCategoryUseCase(repository);
      const result = await useCase.execute({ id: input.id });

      if (!result.success || !result.category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: result.error || "Service category not found",
        });
      }

      return result.category.toObject();
    }),

  /**
   * List service categories for a business (PRIVATE)
   */
  list: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        search: z.string().optional(),
        limit: z.number().int().positive().optional(),
        offset: z.number().int().nonnegative().optional(),
      })
    )
    .query(async ({ input }) => {
      const repository = new PrismaServiceCategoryRepository();
      const useCase = new ListServiceCategoriesUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.categories) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch service categories",
        });
      }

      return {
        categories: result.categories.map((c) => c.toObject()),
        total: result.total || 0,
      };
    }),

  /**
   * Create a new service category (PRIVATE)
   */
  create: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        name: z.string().min(1, "Name is required").max(255),
        description: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const repository = new PrismaServiceCategoryRepository();
      const useCase = new CreateServiceCategoryUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to create service category",
        });
      }

      return result.category.toObject();
    }),

  /**
   * Update an existing service category (PRIVATE)
   */
  update: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Service category ID must be a valid UUID"),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const repository = new PrismaServiceCategoryRepository();
      const useCase = new UpdateServiceCategoryUseCase(repository);
      const result = await useCase.execute(input);

      if (!result.success || !result.category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to update service category",
        });
      }

      return result.category.toObject();
    }),

  /**
   * Delete a service category (PRIVATE)
   */
  delete: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Service category ID must be a valid UUID"),
      })
    )
    .mutation(async ({ input }) => {
      const repository = new PrismaServiceCategoryRepository();
      const useCase = new DeleteServiceCategoryUseCase(repository);
      const result = await useCase.execute({ id: input.id });

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Failed to delete service category",
        });
      }

      return { success: true };
    }),
});
