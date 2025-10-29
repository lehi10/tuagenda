"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, AuthState } from "@/lib/auth/types";
import { getAuthService } from "@/lib/auth/auth-service";

interface AuthContextValue extends AuthState {
  /**
   * Sign in with email and password
   */
  signIn: (credentials: { email: string; password: string }) => Promise<void>;

  /**
   * Sign up with email and password
   */
  signUp: (credentials: {
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;

  /**
   * Sign in with Google
   */
  signInWithGoogle: () => Promise<void>;

  /**
   * Sign out current user
   */
  signOut: () => Promise<void>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail: (email: string) => Promise<void>;

  /**
   * Update user profile
   */
  updateProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const authService = getAuthService();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        user: user as AuthUser | null,
        loading: false,
      }));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [authService]);

  const signIn = async (credentials: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signInWithEmailAndPassword(credentials);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error("Sign in failed"),
      }));
      throw error;
    }
  };

  const signUp = async (credentials: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signUpWithEmailAndPassword(credentials);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error("Sign up failed"),
      }));
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signInWithGoogle();
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Google sign in failed"),
      }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error("Sign out failed"),
      }));
      throw error;
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await authService.sendPasswordResetEmail(email);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error
            : new Error("Password reset failed"),
      }));
      throw error;
    }
  };

  const updateProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await authService.updateProfile(data);
      // Refresh user data
      const updatedUser = authService.getCurrentUser();
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error
            : new Error("Profile update failed"),
      }));
      throw error;
    }
  };

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 *
 * Usage:
 * ```tsx
 * const { user, loading, signIn, signOut } = useAuth();
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
