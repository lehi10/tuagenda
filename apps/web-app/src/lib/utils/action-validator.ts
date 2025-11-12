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

export type ActionError = { success: false; error: string };

/**
 * Validates input and executes a server action handler
 *
 * @param schema - Zod schema for input validation
 * @param input - Unknown input from client (to be validated)
 * @param handler - Handler function that receives validated data
 * @param options - Optional configuration (error message)
 * @returns Result from handler or error object
 *
 * @example
 * ```typescript
 * return validateAndExecute(
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
export async function validateAndExecute<TInput, TResult>(
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
