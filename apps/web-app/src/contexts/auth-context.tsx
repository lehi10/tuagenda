"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthState, FirebaseUserData } from "@/lib/auth/types";
import { getAuthService } from "@/lib/auth/auth-service";
import { getUserById } from "@/actions/user/get-user.action";
import { logger } from "@/lib/logger";

interface AuthContextValue extends AuthState {
  /**
   * Sign in with email and password
   */
  signIn: (credentials: { email: string; password: string }) => Promise<void>;

  /**
   * Sign up with email and password
   * Returns the created user data
   */
  signUp: (credentials: {
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<FirebaseUserData>;

  /**
   * Sign in with Google
   * Returns the authenticated user data
   */
  signInWithGoogle: () => Promise<FirebaseUserData>;

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
  getUserAuthProviders: () => string[] | undefined;
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
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is authenticated - clear all queries before loading new data
        logger.info(
          "AUTH_CONTEXT",
          firebaseUser.uid,
          "User authenticated, clearing query cache"
        );
        queryClient.clear();

        // Load data from database
        setState((prev) => ({ ...prev, loading: true }));

        try {
          // Retry logic to handle race condition where user is being created
          let result;
          let attempts = 0;
          const maxAttempts = 3;
          const delayMs = 1000; // 1 second between retries

          while (attempts < maxAttempts) {
            result = await getUserById(firebaseUser.uid);

            if (result.success) {
              break; // User found, exit retry loop
            }

            attempts++;
            if (attempts < maxAttempts) {
              logger.info(
                "AUTH_CONTEXT",
                firebaseUser.uid,
                `User not found, retrying (${attempts}/${maxAttempts})...`
              );
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
          }

          if (result?.success) {
            // Successfully loaded user data from database
            logger.info(
              "AUTH_CONTEXT",
              firebaseUser.uid,
              "User data loaded from database"
            );
            setState({
              user: result.user,
              loading: false,
              error: null,
            });
          } else {
            // User not found in database after retries
            logger.error(
              "AUTH_CONTEXT",
              firebaseUser.uid,
              `User not found in database after ${maxAttempts} attempts: ${result?.error}`
            );
            setState({
              user: null,
              loading: false,
              error: new Error(
                "User data not found in database. Please try logging in again."
              ),
            });
          }
        } catch (error) {
          logger.error(
            "AUTH_CONTEXT",
            firebaseUser.uid,
            `Error loading user data: ${error instanceof Error ? error.message : String(error)}`
          );
          setState({
            user: null,
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error("Failed to load user data"),
          });
        }
      } else {
        // User is signed out or session expired - clear all queries and user data
        logger.info(
          "AUTH_CONTEXT",
          "anonymous",
          "User signed out, clearing query cache"
        );
        queryClient.clear();
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [authService, queryClient]);

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
  }): Promise<FirebaseUserData> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const user = await authService.signUpWithEmailAndPassword(credentials);
      // User state will be updated by onAuthStateChanged
      return user;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error("Sign up failed"),
      }));
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<FirebaseUserData> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const user = await authService.signInWithGoogle();
      // User state will be updated by onAuthStateChanged
      return user;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error : new Error("Google sign in failed"),
      }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Clear all queries before signing out
      logger.info(
        "AUTH_CONTEXT",
        state.user?.id || "anonymous",
        "Clearing query cache before sign out"
      );
      queryClient.clear();

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
          error instanceof Error ? error : new Error("Password reset failed"),
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

      // Reload user data from database to get updated information
      const firebaseUser = authService.getCurrentUser();
      if (firebaseUser) {
        const result = await getUserById(firebaseUser.uid);
        if (result.success) {
          setState((prev) => ({ ...prev, user: result.user }));
        }
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error : new Error("Profile update failed"),
      }));
      throw error;
    }
  };

  const getUserAuthProviders = (): string[] | undefined => {
    const firebaseUser = authService.getCurrentUser();
    return firebaseUser?.providerData;
  };

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    getUserAuthProviders,
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
