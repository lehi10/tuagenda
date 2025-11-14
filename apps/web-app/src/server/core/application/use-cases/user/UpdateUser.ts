/**
 * Update User Use Case
 *
 * This use case handles updating user profile information.
 * It follows the hexagonal architecture pattern.
 *
 * @module core/application/use-cases/user
 */

import { User } from "@/server/core/domain/entities/User";
import { IUserRepository } from "@/server/core/domain/repositories/IUserRepository";

/**
 * Input for updating a user
 */
export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  countryCode?: string | null;
  birthday?: Date | null;
  timeZone?: string | null;
  description?: string | null;
  pictureFullPath?: string | null;
}

/**
 * Result of the update user operation
 */
export type UpdateUserResult =
  | { success: true; user: User }
  | { success: false; error: string };

/**
 * Update User Use Case
 *
 * Handles updating user profile information with business logic validation.
 */
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserResult> {
    try {
      // Find existing user
      const existingUser = await this.userRepository.findById(input.id);

      if (!existingUser) {
        return {
          success: false,
          error: "User not found",
        };
      }

      // Use domain entity's updateProfile method which includes validation
      existingUser.updateProfile({
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? undefined,
        countryCode: input.countryCode ?? undefined,
        birthday: input.birthday ?? undefined,
        timeZone: input.timeZone ?? undefined,
        description: input.description ?? undefined,
        pictureFullPath: input.pictureFullPath ?? undefined,
      });

      // Persist updated user
      const updatedUser = await this.userRepository.update(existingUser);

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      };
    }
  }
}
