import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../trpc";
import { privateProcedure, publicProcedure } from "../procedures";
import {
  GetUserUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  UpdateUserAdminUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  SearchUsersUseCase,
  CreateGuestUserUseCase,
} from "@/server/core/application/use-cases/user";
import { UserType, UserStatus } from "@/server/core/domain/entities/User";
import { PrismaUserRepository } from "@/server/infrastructure/repositories";

/**
 * User router
 * Contains all user-related procedures
 */
export const userRouter = router({
  /**
   * Get user by ID
   * Migrated from: getUserByIdAction
   */
  getById: privateProcedure
    .input(z.object({ userId: z.string().min(1, "User ID is required") }))
    .query(async ({ input }) => {
      const userRepository = new PrismaUserRepository();
      const getUserUseCase = new GetUserUseCase(userRepository);

      const result = await getUserUseCase.execute({ id: input.userId });

      if (!result.success || !result.user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: result.error || "User not found",
        });
      }

      return result.user.toObject();
    }),

  /**
   * Get current authenticated user
   * Uses userId from context (Firebase token)
   */
  me: privateProcedure.query(async ({ ctx }) => {
    const userRepository = new PrismaUserRepository();
    const getUserUseCase = new GetUserUseCase(userRepository);

    const result = await getUserUseCase.execute({ id: ctx.userId });

    if (!result.success || !result.user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return result.user.toObject();
  }),

  /**
   * Create a new user
   * Migrated from: createUserAction
   */
  create: privateProcedure
    .input(
      z.object({
        id: z.string().min(1, "Firebase UID is required"),
        email: z.string().email("Invalid email format"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string(),
        pictureFullPath: z.string().url().nullish(),
        phone: z.string().nullish(),
        countryCode: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Security: Validate that the authenticated user ID matches the ID being created
      if (input.id !== ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized: Cannot create user with different ID",
        });
      }

      const userRepository = new PrismaUserRepository();
      const createUserUseCase = new CreateUserUseCase(userRepository);

      const truncatedData = {
        ...input,
        firstName: input.firstName.substring(0, 255),
        lastName: input.lastName.substring(0, 255),
        phone: input.phone || null,
        countryCode: input.countryCode || null,
      };

      const result = await createUserUseCase.execute(truncatedData);

      if (!result.success || !result.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to create user",
        });
      }

      return { userId: result.user.id };
    }),

  /**
   * Update user profile
   * Migrated from: updateUserProfileAction
   */
  updateProfile: privateProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        birthday: z.date().nullable().optional(),
        phone: z.string().nullable().optional(),
        countryCode: z.string().nullable().optional(),
        timeZone: z.string().nullable().optional(),
        pictureFullPath: z.string().url().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userRepository = new PrismaUserRepository();
      const updateUserUseCase = new UpdateUserUseCase(userRepository);

      const updateInput = {
        id: input.userId,
        firstName: input.firstName,
        lastName: input.lastName,
        birthday: input.birthday || null,
        phone: input.phone || null,
        countryCode: input.countryCode || null,
        timeZone: input.timeZone || null,
        pictureFullPath: input.pictureFullPath,
      };

      const result = await updateUserUseCase.execute(updateInput);

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to update profile",
        });
      }

      return { message: "Profile updated successfully" };
    }),

  /**
   * Update user admin fields (type and status)
   * Migrated from: updateUserAdmin
   */
  updateAdmin: privateProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        type: z.nativeEnum(UserType).optional(),
        status: z.nativeEnum(UserStatus).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userRepository = new PrismaUserRepository();
      const updateUserAdminUseCase = new UpdateUserAdminUseCase(userRepository);

      const result = await updateUserAdminUseCase.execute({
        id: input.userId,
        type: input.type,
        status: input.status,
      });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to update user",
        });
      }

      return { success: true };
    }),

  /**
   * Delete a user
   * Migrated from: deleteUser
   */
  delete: privateProcedure
    .input(z.object({ userId: z.string().min(1, "User ID is required") }))
    .mutation(async ({ input }) => {
      const userRepository = new PrismaUserRepository();
      const deleteUserUseCase = new DeleteUserUseCase(userRepository);

      const result = await deleteUserUseCase.execute({ id: input.userId });

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to delete user",
        });
      }

      return { success: true };
    }),

  /**
   * Get all users with filtering
   * Migrated from: getAllUsersAction
   */
  getAll: privateProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          type: z.nativeEnum(UserType).optional(),
          status: z.nativeEnum(UserStatus).optional(),
          limit: z.number().int().positive().optional(),
          offset: z.number().int().nonnegative().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const userRepository = new PrismaUserRepository();
      const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

      const result = await getAllUsersUseCase.execute(input || {});

      if (!result.success || !result.users) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to fetch users",
        });
      }

      return {
        users: result.users.map((user) => user.toObject()),
        total: result.total || 0,
      };
    }),

  /**
   * Search users by email or name
   * Migrated from: searchUsersAction
   */
  search: privateProcedure
    .input(
      z.object({
        search: z.string().min(1, "Search term is required"),
        limit: z.number().int().positive().optional(),
      })
    )
    .query(async ({ input }) => {
      const userRepository = new PrismaUserRepository();
      const searchUsersUseCase = new SearchUsersUseCase(userRepository);

      const result = await searchUsersUseCase.execute(input);

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to search users",
        });
      }

      return { users: result.users || [] };
    }),

  /**
   * Create or find guest user (PUBLIC - for booking flow)
   * Creates a guest user if doesn't exist, or returns existing guest user
   */
  createGuest: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1).max(255),
        lastName: z.string().min(1).max(255),
        phone: z.string().max(63).nullable().optional(),
        countryCode: z.string().max(10).nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userRepository = new PrismaUserRepository();
      const createGuestUserUseCase = new CreateGuestUserUseCase(userRepository);

      try {
        const user = await createGuestUserUseCase.execute({
          ...input,
          phone: input.phone ?? undefined,
          countryCode: input.countryCode ?? undefined,
        });
        return { user: user.toObject() };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create guest user",
        });
      }
    }),
});
