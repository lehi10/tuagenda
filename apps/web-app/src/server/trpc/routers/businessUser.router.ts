/**
 * BusinessUser Router
 *
 * tRPC router for business-user relationship operations.
 * Replaces Server Actions from src/server/api/business-user
 *
 * All procedures are PRIVATE (require authentication)
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { privateProcedure, publicProcedure } from "../procedures";
import {
  PrismaBusinessUserRepository,
  PrismaUserRepository,
} from "@/server/infrastructure/repositories";
import {
  CreateBusinessUserUseCase,
  UpdateBusinessUserUseCase,
  DeleteBusinessUserUseCase,
  GetBusinessUsersByBusinessUseCase,
  GetBusinessUsersByUserUseCase,
  GetBusinessUsersWithDetailsUseCase,
} from "@/server/core/application/use-cases/business-user";
import { BusinessRole } from "@/server/core/domain/entities";

export const businessUserRouter = router({
  /**
   * List active professionals for a business (PUBLIC)
   * Returns only active employees and managers who can provide services for public booking flow
   */
  listPublicEmployees: publicProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        serviceId: z.string().uuid().optional(), // Optional: filter by service
      })
    )
    .query(async ({ input }) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersWithDetailsUseCase =
        new GetBusinessUsersWithDetailsUseCase(businessUserRepository);

      const result = await getBusinessUsersWithDetailsUseCase.execute({
        businessId: input.businessId,
      });

      if (!result.success || !result.businessUsers) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch professionals",
        });
      }

      // Filter only active employees and managers (both can provide services)
      const activeProfessionals = result.businessUsers.filter(
        (bu) =>
          (bu.role === BusinessRole.EMPLOYEE ||
            bu.role === BusinessRole.MANAGER) &&
          bu.isActive
      );

      // Map to public professional format
      const employees = activeProfessionals.map((bu) => ({
        id: bu.id,
        name: bu.displayName || `${bu.user.firstName} ${bu.user.lastName}`,
        firstName: bu.user.firstName,
        lastName: bu.user.lastName,
        avatar: bu.user.pictureFullPath || null,
        email: bu.user.email,
        phone: bu.user.phone || null,
        role: bu.role, // Include role to differentiate if needed
      }));

      return {
        employees,
        total: employees.length,
      };
    }),

  /**
   * Create a business-user relationship
   * Uses authenticated user's ID
   */
  create: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        userId: z.string().min(1, "User ID is required"),
        role: z.nativeEnum(BusinessRole),
      })
    )
    .mutation(async ({ input }) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const userRepository = new PrismaUserRepository();
      const createBusinessUserUseCase = new CreateBusinessUserUseCase(
        businessUserRepository,
        userRepository
      );

      const result = await createBusinessUserUseCase.execute({
        userId: input.userId,
        businessId: input.businessId,
        role: input.role,
      });

      if (!result.success || !result.businessUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            result.error || "Failed to create business-user relationship",
        });
      }

      return result.businessUser.toObject();
    }),

  /**
   * Update a business-user relationship (mainly role)
   */
  update: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Business User ID must be a valid UUID"),
        role: z.nativeEnum(BusinessRole),
      })
    )
    .mutation(async ({ input }) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const updateBusinessUserUseCase = new UpdateBusinessUserUseCase(
        businessUserRepository
      );

      const result = await updateBusinessUserUseCase.execute(input);

      if (!result.success || !result.businessUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            result.error || "Failed to update business-user relationship",
        });
      }

      return result.businessUser.toObject();
    }),

  /**
   * Delete a business-user relationship
   */
  delete: privateProcedure
    .input(
      z.object({
        id: z.string().uuid("Business User ID must be a valid UUID"),
      })
    )
    .mutation(async ({ input }) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const userRepository = new PrismaUserRepository();
      const deleteBusinessUserUseCase = new DeleteBusinessUserUseCase(
        businessUserRepository,
        userRepository
      );

      const result = await deleteBusinessUserUseCase.execute(input);

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            result.error || "Failed to delete business-user relationship",
        });
      }

      return { success: true };
    }),

  /**
   * Get all users associated with a business
   */
  getByBusiness: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        role: z.nativeEnum(BusinessRole).optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersByBusinessUseCase =
        new GetBusinessUsersByBusinessUseCase(businessUserRepository);

      const result = await getBusinessUsersByBusinessUseCase.execute(input);

      if (!result.success || !result.businessUsers) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to get business users",
        });
      }

      return result.businessUsers.map((bu) => bu.toObject());
    }),

  /**
   * Get all businesses associated with the authenticated user
   */
  getByUser: privateProcedure
    .input(
      z
        .object({
          userId: z.string().min(1),
          role: z.nativeEnum(BusinessRole).optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersByUserUseCase = new GetBusinessUsersByUserUseCase(
        businessUserRepository
      );

      const result = await getBusinessUsersByUserUseCase.execute({
        userId: input?.userId || ctx.userId,
        role: input?.role,
        limit: input?.limit,
        offset: input?.offset,
      });

      if (!result.success || !result.businessUsers) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to get user businesses",
        });
      }

      return result.businessUsers.map((bu) => bu.toObject());
    }),

  /**
   * Get business users with full user details
   * Used for employee list views
   */
  getWithDetails: privateProcedure
    .input(
      z.object({
        businessId: z.string().uuid("Business ID must be a valid UUID"),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const businessUserRepository = new PrismaBusinessUserRepository();
      const getBusinessUsersWithDetailsUseCase =
        new GetBusinessUsersWithDetailsUseCase(businessUserRepository);

      const result = await getBusinessUsersWithDetailsUseCase.execute(input);

      if (!result.success || !result.businessUsers) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            result.error || "Failed to fetch business users with details",
        });
      }

      return result.businessUsers;
    }),
});
