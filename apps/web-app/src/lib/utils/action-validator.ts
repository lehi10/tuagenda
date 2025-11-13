/**
 * Action Validator Utility
 *
 * Provides a wrapper for server actions to handle Zod validation
 * and error handling in a consistent way across all actions.
 *
 * This eliminates the need for repetitive try-catch blocks in every action.
 *
 * @module lib/utils/action-validator
 */
import { z } from "zod";
import { verifyAuthToken } from "@/lib/auth/firebase/admin";
import { getAuthErrorMessage } from "@/lib/auth/errors";

export type ActionError = { success: false; error: string };

/**
 * Validates input and executes a PUBLIC server action handler
 *
 * Use this for server actions that don't require authentication.
 *
 * @param schema - Zod schema for input validation
 * @param input - Unknown input from client (to be validated)
 * @param handler - Handler function that receives validated data
 * @param options - Optional configuration (error message)
 * @returns Result from handler or error object
 *
 * @example
 * ```typescript
 * return validatePublicAction(
 *   deleteUserSchema,
 *   input,
 *   async (validated) => {
 *     const repository = new PrismaUserRepository();
 *     const useCase = new DeleteUserUseCase(repository);
 *     return await useCase.execute({ id: validated.userId });
 *   },
 *   { errorMessage: "Failed to delete user" }
 * );
 * ```
 */
export async function validatePublicAction<TInput, TResult>(
  schema: z.ZodSchema<TInput>,
  input: unknown,
  handler: (validated: TInput) => Promise<TResult | ActionError>,
  options?: {
    errorMessage?: string;
  }
): Promise<TResult | ActionError> {
  try {
    const validated = schema.parse(input);
    return await handler(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation error: ${error.message}`,
      };
    }

    return {
      success: false,
      error: options?.errorMessage || "An unexpected error occurred",
    };
  }
}

/**
 * Validates input, verifies authentication token, and executes a PRIVATE server action handler
 *
 * Use this for server actions that require authentication.
 * It extracts the _token from input, verifies it with Firebase Admin,
 * and passes the authenticated userId to the handler.
 *
 * @param schema - Zod schema for input validation (should NOT include _token)
 * @param input - Unknown input from client (must include _token property)
 * @param handler - Handler function that receives validated data and userId
 * @param options - Optional configuration (error message)
 * @returns Result from handler or error object
 *
 * @example
 * ```typescript
 * return validatePrivateAction(
 *   getUserSchema,
 *   input,
 *   async (validated, userId) => {
 *     const repository = new PrismaUserRepository();
 *     const useCase = new GetUserUseCase(repository);
 *     return await useCase.execute({ id: userId });
 *   },
 *   { errorMessage: "Failed to get user" }
 * );
 * ```
 */
export async function validatePrivateAction<TInput, TResult>(
  schema: z.ZodSchema<TInput>,
  input: unknown,
  handler: (
    validated: TInput,
    userId: string
  ) => Promise<TResult | ActionError>,
  options?: {
    errorMessage?: string;
  }
): Promise<TResult | ActionError> {
  try {
    // Extract token from input
    const inputWithToken = input as any;
    const token = inputWithToken?._token;

    if (!token || typeof token !== "string") {
      return {
        success: false,
        error: "Token de autenticación no proporcionado",
      };
    }

    // Verify token
    let userId: string;
    try {
      const decoded = await verifyAuthToken(token);
      userId = decoded.uid;
    } catch (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error),
      };
    }

    // Remove _token from input before validation
    const { _token, ...inputWithoutToken } = inputWithToken;

    // Validate input
    const validated = schema.parse(inputWithoutToken);

    // Execute handler with validated data and userId
    return await handler(validated, userId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation error: ${error.message}`,
      };
    }

    return {
      success: false,
      error: options?.errorMessage || "An unexpected error occurred",
    };
  }
}
