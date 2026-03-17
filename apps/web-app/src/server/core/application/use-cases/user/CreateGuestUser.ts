/**
 * Create Guest User Use Case
 *
 * Creates a guest user (without Firebase authentication) for booking purposes.
 * Guest users can later be converted to registered users.
 *
 * @module core/application/use-cases/user
 */

import { randomUUID } from "crypto";
import type { IUserRepository } from "@/server/core/domain/repositories/IUserRepository";
import { User } from "@/server/core/domain/entities/User";

export interface CreateGuestUserInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode?: string;
}

export class CreateGuestUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateGuestUserInput): Promise<User> {
    // 1. Check if user already exists by email
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      // If user exists and is a guest, reuse it
      if (existingUser.isGuestUser()) {
        return existingUser;
      }

      // If user exists and is registered, throw error
      throw new Error(
        "A registered user with this email already exists. Please log in instead."
      );
    }

    // 2. Create new guest user with UUID
    const guestUser = User.createGuest({
      id: randomUUID(),
      email: input.email.toLowerCase().trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone?.trim() || null,
      countryCode: input.countryCode || null,
    });

    // 3. Persist to database
    const createdUser = await this.userRepository.create(guestUser);

    return createdUser;
  }
}
