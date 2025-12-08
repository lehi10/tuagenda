/**
 * Business Router
 *
 * tRPC router for business-related operations.
 * Replaces Server Actions from src/server/api/business
 *
 * Public procedures: getById, getBySlug
 * Private procedures: create, update, delete, list, getByIds
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { publicProcedure, privateProcedure } from "../procedures";
import { PrismaBusinessRepository } from "@/server/infrastructure/repositories";
import {
  GetBusinessUseCase,
  GetBusinessBySlugUseCase,
  CreateBusinessUseCase,
  UpdateBusinessUseCase,
  DeleteBusinessUseCase,
  ListBusinessesUseCase,
} from "@/server/core/application/use-cases/business";
import { GetBusinessesByIdsUseCase } from "@/server/core/application/use-cases/business/GetBusinessesByIds";

export const businessRouter = router({
  /**
   * Get a business by ID (PUBLIC)
   * Used for viewing business details
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.uuid("Business ID must be a valid UUID"),
      })
    )
    .query(async ({ input }) => {
      const businessRepository = new PrismaBusinessRepository();
      const getBusinessUseCase = new GetBusinessUseCase(businessRepository);
      const result = await getBusinessUseCase.execute({ id: input.id });

      if (!result.success || !result.business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: result.error || "Business not found",
        });
      }

      return result.business.toObject();
    }),

  /**
   * Get a business by slug (PUBLIC)
   * Used for public booking pages like /book/my-business-slug
   */
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1, "Slug is required"),
      })
    )
    .query(async ({ input }) => {
      const businessRepository = new PrismaBusinessRepository();
      const getBusinessBySlugUseCase = new GetBusinessBySlugUseCase(
        businessRepository
      );
      const result = await getBusinessBySlugUseCase.execute({
        slug: input.slug,
      });

      if (!result.success || !result.business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: result.error || "Business not found",
        });
      }

      return result.business.toObject();
    }),

  /**
   * Create a new business (PRIVATE)
   */
  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().min(1, "Slug is required"),
        domain: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        coverImage: z.string().optional(),
        timeZone: z.string().min(1, "Time zone is required"),
        locale: z.string().min(1, "Locale is required"),
        currency: z.string().min(1, "Currency is required"),
        status: z.enum(["active", "inactive", "suspended"]).optional(),
        email: z.string().email("Invalid email format"),
        phone: z.string().min(1, "Phone is required"),
        website: z.string().optional(),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().optional(),
        country: z.string().min(1, "Country is required"),
        postalCode: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const businessRepository = new PrismaBusinessRepository();
      const createBusinessUseCase = new CreateBusinessUseCase(
        businessRepository
      );
      const result = await createBusinessUseCase.execute(input);

      if (!result.success || !result.business) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to create business",
        });
      }

      return result.business.toObject();
    }),

  /**
   * Update an existing business (PRIVATE)
   */
  update: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Business ID must be a valid UUID"),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        domain: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        coverImage: z.string().optional(),
        timeZone: z.string().optional(),
        locale: z.string().optional(),
        currency: z.string().optional(),
        status: z.enum(["active", "inactive", "suspended"]).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const businessRepository = new PrismaBusinessRepository();
      const updateBusinessUseCase = new UpdateBusinessUseCase(
        businessRepository
      );
      const result = await updateBusinessUseCase.execute(input);

      if (!result.success || !result.business) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to update business",
        });
      }

      return result.business.toObject();
    }),

  /**
   * Delete a business (PRIVATE)
   */
  delete: privateProcedure
    .input(
      z.object({
        id: z.uuid("Business ID must be a valid UUID"),
      })
    )
    .mutation(async ({ input, ctx: _ctx }) => {
      const businessRepository = new PrismaBusinessRepository();
      const deleteBusinessUseCase = new DeleteBusinessUseCase(
        businessRepository
      );
      const result = await deleteBusinessUseCase.execute({ id: input.id });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to delete business",
        });
      }

      return { success: true };
    }),

  /**
   * List businesses with optional filters (PRIVATE)
   */
  list: privateProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
          limit: z.number().int().positive().optional(),
          offset: z.number().int().nonnegative().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const businessRepository = new PrismaBusinessRepository();
      const listBusinessesUseCase = new ListBusinessesUseCase(
        businessRepository
      );
      const result = await listBusinessesUseCase.execute(input || {});

      if (!result.success || !result.businesses) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch businesses",
        });
      }

      return {
        businesses: result.businesses.map((b) => b.toObject()),
        total: result.total || 0,
      };
    }),

  /**
   * Get multiple businesses by IDs (PRIVATE)
   */
  getByIds: privateProcedure
    .input(
      z.object({
        ids: z
          .array(z.string().uuid("Each ID must be a valid UUID"))
          .min(1, "At least one ID is required"),
      })
    )
    .query(async ({ input }) => {
      const businessRepository = new PrismaBusinessRepository();
      const getBusinessesByIdsUseCase = new GetBusinessesByIdsUseCase(
        businessRepository
      );
      const result = await getBusinessesByIdsUseCase.execute(input);

      if (!result.success || !result.businesses) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to get businesses",
        });
      }

      return result.businesses.map((b) => b.toObject());
    }),
});
