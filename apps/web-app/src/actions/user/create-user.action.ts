/**
 * Create User Server Action
 *
 * This server action handles creating new users in the PostgreSQL database
 * after they successfully authenticate with Firebase. All new users are
 * created with the 'customer' type by default.
 *
 * @module actions/user
 */

"use server";

import { z } from "zod";
import { CreateUserUseCase } from "@/core/application/use-cases/user";
import { PrismaUserRepository } from "@/infrastructure/repositories";
import { validatePrivateAction } from "@/lib/utils/action-validator";

// Schema validation for creating user from Firebase Auth
const createUserFromAuthSchema = z.object({
  id: z.string().min(1, "Firebase UID is required"),
  email: z.email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string(), // Allow empty string for users with single name
  pictureFullPath: z.url().nullish(),
});

export type CreateUserFromAuthInput = z.infer<typeof createUserFromAuthSchema>;

type CreateUserResult =
  | { success: true; userId: string }
  | { success: false; error: string };

/**
 * Creates a new user in the database with 'customer' type
 *
 * This function should be called after successful Firebase authentication
 * to sync the user data to your PostgreSQL database.
 *
 * @param input - User data from Firebase Auth
 * @returns Result object with success status and user ID or error message
 */
export async function createUserAction(
  input: unknown
): Promise<CreateUserResult> {
  return validatePrivateAction(
    createUserFromAuthSchema,
    input,
    async (validated, userId) => {
      // Security: Validate that the authenticated user ID matches the ID being created
      if (validated.id !== userId) {
        return {
          success: false,
          error: "Unauthorized: Cannot create user with different ID",
        };
      }

      const userRepository = new PrismaUserRepository();
      const createUserUseCase = new CreateUserUseCase(userRepository);

      const truncatedData = {
        ...validated,
        firstName: validated.firstName.substring(0, 255),
        lastName: validated.lastName.substring(0, 255),
      };

      const result = await createUserUseCase.execute(truncatedData);

      if (result.success && result.user) {
        return {
          success: true,
          userId: result.user.id,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to create user",
      };
    },
    { errorMessage: "An unexpected error occurred while creating user" }
  );
}
