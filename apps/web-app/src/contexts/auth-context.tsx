"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, FirebaseUserData } from "@/lib/auth/types";
import { getAuthService } from "@/lib/auth/auth-service";
import { getUserByIdAction } from "@/actions/user/get-user.action";
import { createUserAction } from "@/actions/user/create-user.action";
import { parseFullName } from "@/lib/utils/name-parser";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { withAuth } from "@/lib/auth/with-auth";

interface AuthContextValue extends AuthState {
  /**
   * Sign in with email and password
   */
  signIn: (_credentials: { email: string; password: string }) => Promise<void>;

  /**
   * Sign up with email and password
   * Returns the created user data
   */
  signUp: (_credentials: {
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
  sendPasswordResetEmail: (_email: string) => Promise<void>;

  /**
   * Update user profile
   */
  updateProfile: (_data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;

  /**
   * Get user auth providers
   */
  getUserAuthProviders: () => string[] | undefined;

  /**
   * Get current user ID token for authenticated requests
   */
  getIdToken: (_forceRefresh?: boolean) => Promise<string | null>;
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
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setState((prev) => ({ ...prev, loading: true }));

        try {
          // Get user from database
          const result = await withAuth(getUserByIdAction, {
            userId: firebaseUser.uid,
          });

          if (result.success) {
            setState({
              user: result.user,
              loading: false,
              error: null,
            });
          } else {
            // User not in database - create new user (Google first-time login)
            const { firstName, lastName } = parseFullName(
              firebaseUser.displayName || ""
            );

            const createResult = await withAuth(createUserAction, {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              firstName,
              lastName,
              pictureFullPath: firebaseUser.photoURL,
            });

            if (createResult.success) {
              // Fetch the newly created user
              const newUserResult = await withAuth(getUserByIdAction, {
                userId: firebaseUser.uid,
              });

              if (newUserResult.success) {
                setState({
                  user: newUserResult.user,
                  loading: false,
                  error: null,
                });
              } else {
                setState({
                  user: null,
                  loading: false,
                  error: new Error(newUserResult.error),
                });
              }
            } else {
              setState({
                user: null,
                loading: false,
                error: new Error(createResult.error),
              });
            }
          }
        } catch (error) {
          setState({
            user: null,
            loading: false,
            error: new Error(getAuthErrorMessage(error)),
          });
        }
      } else {
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, [authService]);

  const signIn = async (credentials: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signInWithEmailAndPassword(credentials);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: new Error(getAuthErrorMessage(error)),
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
      const firebaseUser =
        await authService.signUpWithEmailAndPassword(credentials);
      return firebaseUser;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: new Error(getAuthErrorMessage(error)),
      }));
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<FirebaseUserData> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const firebaseUser = await authService.signInWithGoogle();
      return firebaseUser;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: new Error(getAuthErrorMessage(error)),
      }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: new Error(getAuthErrorMessage(error)),
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
        error: new Error(getAuthErrorMessage(error)),
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

      const firebaseUser = authService.getCurrentUser();
      if (firebaseUser) {
        const result = await withAuth(getUserByIdAction, {
          userId: firebaseUser.uid,
        });
        if (result.success) {
          setState((prev) => ({ ...prev, user: result.user }));
        }
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: new Error(getAuthErrorMessage(error)),
      }));
      throw error;
    }
  };

  const getUserAuthProviders = (): string[] | undefined => {
    const firebaseUser = authService.getCurrentUser();
    return firebaseUser?.providerData;
  };

  const getIdToken = async (forceRefresh?: boolean): Promise<string | null> => {
    return authService.getIdToken(forceRefresh);
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
    getIdToken,
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
