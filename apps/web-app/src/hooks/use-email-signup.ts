/**
 * Custom hook for email/password signup
 *
 * Handles the complete signup flow:
 * 1. Create user in Firebase Auth
 * 2. Save user data to PostgreSQL
 * 3. Show appropriate toasts
 * 4. Handle errors
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts";
import { createUserInDatabase } from "@/actions/user";
import { toast } from "sonner";

interface UseEmailSignupOptions {
  onSuccess?: () => void;
}

export function useEmailSignup(options?: UseEmailSignupOptions) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create user in Firebase Auth
      toast.loading("Creating your account...");
      const firebaseUser = await signUp({
        email: data.email,
        password: data.password,
        displayName: data.fullName,
      });
      toast.dismiss();
      toast.success("Account created in Firebase");

      // Step 2: Split full name into first and last name
      const nameParts = data.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "";

      // Step 3: Create user in PostgreSQL database as 'customer'
      console.log('🔄 Creating user in database...', {
        uid: firebaseUser.uid,
        email: firebaseUser.email || data.email,
        firstName,
        lastName,
      });

      toast.loading("Saving your profile...");
      const dbResult = await createUserInDatabase({
        id: firebaseUser.uid,
        email: firebaseUser.email || data.email,
        firstName,
        lastName,
        pictureFullPath: firebaseUser.photoURL,
      });
      toast.dismiss();

      if (!dbResult.success) {
        console.error('❌ Failed to create user in database:', dbResult.error);
        toast.error(`Failed to save profile: ${dbResult.error}`);
        setError(`Account created but profile save failed: ${dbResult.error}`);
        setLoading(false);
        return { success: false, error: dbResult.error };
      }

      console.log('✅ User created successfully in database:', dbResult.userId);
      toast.success("Account created successfully! 🎉");

      setLoading(false);
      options?.onSuccess?.();
      return { success: true };
    } catch (err) {
      toast.dismiss();
      const errorMessage = err instanceof Error
        ? err.message
        : "Failed to create account. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    signup,
    loading,
    error,
  };
}
