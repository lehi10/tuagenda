/**
 * Update User Admin Use Case
 *
 * Updates user admin fields (type, status).
 * This is separate from regular user updates.
 *
 * REFACTORED: Validation removed from use case (now in action layer).
 * Receives pre-validated data from server actions.
 */

import {
  IUserRepository,
  UpdateUserAdminData,
} from "@/server/core/domain/repositories/IUserRepository";
import { UserType, UserStatus } from "@/server/core/domain/entities/User";
import { logger } from "@/server/lib/logger";
import { syncUserType } from "@/server/lib/auth/authorization";

export interface UpdateUserAdminInput {
  id: string;
  type?: UserType;
  status?: UserStatus;
}

export interface UpdateUserAdminResult {
  success: boolean;
  error?: string;
}

export class UpdateUserAdminUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserAdminInput): Promise<UpdateUserAdminResult> {
    try {
      // Check if there's anything to update
      if (!input.type && !input.status) {
        return {
          success: false,
          error: "No fields to update",
        };
      }

      logger.info(
        "UpdateUserAdminUseCase",
        input.id,
        `Updating user admin fields: type=${input.type}, status=${input.status}`
      );

      // Get current user if type is being updated
      let oldUserType: UserType | undefined;
      if (input.type) {
        const currentUser = await this.userRepository.findById(input.id);
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
      if (input.type) updateData.type = input.type;
      if (input.status) updateData.status = input.status;

      await this.userRepository.updateAdmin(input.id, updateData);

      // Sync user type with authorization system if type changed
      if (input.type && oldUserType !== input.type) {
        logger.info(
          "UpdateUserAdminUseCase",
          input.id,
          `Syncing user type change: ${oldUserType} -> ${input.type}`
        );

        // Remove old user type
        if (oldUserType && oldUserType !== UserType.CUSTOMER) {
          await syncUserType(
            input.id,
            oldUserType === UserType.ADMIN ? "admin" : "superadmin",
            "remove"
          );
        }

        // Add new user type
        if (input.type !== UserType.CUSTOMER) {
          await syncUserType(
            input.id,
            input.type === UserType.ADMIN ? "admin" : "superadmin",
            "add"
          );
        }
      }

      logger.info(
        "UpdateUserAdminUseCase",
        input.id,
        "User updated successfully"
      );

      return {
        success: true,
      };
    } catch (error) {
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
