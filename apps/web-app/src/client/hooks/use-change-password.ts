/**
 * Change Password Hook
 *
 * Client-side hook for changing user password using Firebase Authentication.
 * Re-authenticates the user with current password before changing.
 */

import { useState, useCallback } from "react";
import { authService } from "@/client/lib/auth/auth-service";
import { logger } from "@/shared/lib/logger";

interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

interface UseChangePasswordReturn {
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<ChangePasswordResult>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook to change user password
 * Uses Firebase client SDK for re-authentication and password update
 *
 * @returns Object with changePassword function, loading state, and error
 */
export function useChangePassword(): UseChangePasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string
    ): Promise<ChangePasswordResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const currentUser = authService.getCurrentUser();

        if (!currentUser) {
          const errorMsg = "You must be signed in to change your password";
          setError(errorMsg);
          logger.error("useChangePassword", "anonymous", errorMsg);
          return { success: false, error: errorMsg };
        }

        logger.info(
          "useChangePassword",
          currentUser.uid,
          "Attempting to change password"
        );

        await authService.changePassword(currentPassword, newPassword);

        logger.info(
          "useChangePassword",
          currentUser.uid,
          "Password changed successfully"
        );

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to change password";
        setError(errorMessage);
        logger.error(
          "useChangePassword",
          "anonymous",
          `Password change failed: ${errorMessage}`
        );
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    changePassword,
    isLoading,
    error,
    reset,
  };
}
