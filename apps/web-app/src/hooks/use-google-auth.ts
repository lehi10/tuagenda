/**
 * Custom hook for Google authentication
 *
 * Handles the complete Google auth flow (login or signup):
 * 1. Authenticate with Google via Firebase
 * 2. Save/sync user data to PostgreSQL
 * 3. Show appropriate toasts
 * 4. Handle errors
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts";
import { createUserInDatabase } from "@/actions/user";
import { toast } from "sonner";

interface UseGoogleAuthOptions {
  onSuccess?: () => void;
  mode?: 'login' | 'signup';
}

export function useGoogleAuth(options?: UseGoogleAuthOptions) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mode = options?.mode || 'login';

  const authenticate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Authenticate with Google (Firebase)
      toast.loading("Signing in with Google...");
      const firebaseUser = await signInWithGoogle();
      toast.dismiss();
      toast.success("Google authentication successful");

      // Step 2: Extract first and last name from displayName
      const displayName = firebaseUser.displayName || '';
      const nameParts = displayName.trim().split(/\s+/);
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Step 3: Create/update user in PostgreSQL database as 'customer'
      // This handles both first-time login (creates user) and returning users (no-op)
      console.log('🔄 Attempting to sync user with database...', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName,
        lastName,
      });

      toast.loading(mode === 'signup' ? "Saving your profile..." : "Syncing profile...");
      const dbResult = await createUserInDatabase({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        firstName,
        lastName,
        pictureFullPath: firebaseUser.photoURL,
      });
      toast.dismiss();

      if (!dbResult.success) {
        console.error('❌ Failed to sync user with database:', dbResult.error);
        toast.error(`Failed to sync profile: ${dbResult.error}`);
        setError(`Authentication successful, but failed to sync user data: ${dbResult.error}`);
        setLoading(false);
        return { success: false, error: dbResult.error };
      }

      console.log('✅ User synced successfully to database:', dbResult.userId);

      if (mode === 'signup') {
        toast.success("Account created successfully! 🎉");
      } else {
        toast.success("Welcome back! 🎉");
      }

      setLoading(false);
      options?.onSuccess?.();
      return { success: true };
    } catch (err) {
      toast.dismiss();
      const errorMessage = err instanceof Error
        ? err.message
        : `Failed to ${mode === 'signup' ? 'sign up' : 'sign in'} with Google. Please try again.`;
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    authenticate,
    loading,
    error,
  };
}
