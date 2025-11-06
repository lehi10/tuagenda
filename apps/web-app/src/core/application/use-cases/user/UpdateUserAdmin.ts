/**
 * Update User Admin Use Case
 *
 * Updates user admin fields (type, status).
 * This is separate from regular user updates.
 */

import {
  IUserRepository,
  UpdateUserAdminData,
} from "@/core/domain/repositories/IUserRepository";
import { UserType, UserStatus } from "@/core/domain/entities/User";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { syncUserType } from "@/lib/auth/authorization";

const updateUserAdminSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.nativeEnum(UserType).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;

export interface UpdateUserAdminResult {
  success: boolean;
  error?: string;
}

export class UpdateUserAdminUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: unknown): Promise<UpdateUserAdminResult> {
    try {
      const validatedData = updateUserAdminSchema.parse(input);

      // Check if there's anything to update
      if (!validatedData.type && !validatedData.status) {
        return {
          success: false,
          error: "No fields to update",
        };
      }

      logger.info(
        "UpdateUserAdminUseCase",
        validatedData.userId,
        `Updating user admin fields: type=${validatedData.type}, status=${validatedData.status}`
      );

      // Get current user if type is being updated
      let oldUserType: UserType | undefined;
      if (validatedData.type) {
        const currentUser = await this.userRepository.findById(
          validatedData.userId
        );
        if (!currentUser) {
          return {
            success: false,
            error: "User not found",
          };
        }
        oldUserType = currentUser.type;
      }

      // Update user
      const updateData: UpdateUserAdminData = {};
      if (validatedData.type) updateData.type = validatedData.type;
      if (validatedData.status) updateData.status = validatedData.status;

      await this.userRepository.updateAdmin(validatedData.userId, updateData);

      // Sync user type with authorization system if type changed
      if (validatedData.type && oldUserType !== validatedData.type) {
        logger.info(
          "UpdateUserAdminUseCase",
          validatedData.userId,
          `Syncing user type change: ${oldUserType} -> ${validatedData.type}`
        );

        // Remove old user type
        if (oldUserType && oldUserType !== UserType.CUSTOMER) {
          await syncUserType(
            validatedData.userId,
            oldUserType === UserType.ADMIN ? "admin" : "superadmin",
            "remove"
          );
        }

        // Add new user type
        if (validatedData.type !== UserType.CUSTOMER) {
          await syncUserType(
            validatedData.userId,
            validatedData.type === UserType.ADMIN ? "admin" : "superadmin",
            "add"
          );
        }
      }

      logger.info(
        "UpdateUserAdminUseCase",
        validatedData.userId,
        "User updated successfully"
      );

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Invalid input: " + error.issues[0].message,
        };
      }

      logger.error(
        "UpdateUserAdminUseCase",
        "system",
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      return {
        success: false,
        error: "Failed to update user",
      };
    }
  }
}
