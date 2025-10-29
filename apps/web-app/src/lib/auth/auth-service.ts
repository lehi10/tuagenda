import { IAuthService } from "./types";
import { FirebaseAuthService } from "./firebase/firebase-auth-service";

/**
 * Singleton instance of the auth service
 * This is the ONLY place where we create the auth service instance
 */
let authServiceInstance: IAuthService | null = null;

/**
 * Get the auth service instance
 * This is the main entry point for authentication in the app
 *
 * Usage:
 * ```ts
 * import { getAuthService } from '@/lib/auth/auth-service';
 *
 * const authService = getAuthService();
 * await authService.signIn({ email, password });
 * ```
 */
export function getAuthService(): IAuthService {
  if (!authServiceInstance) {
    // Here we can easily swap Firebase for another provider
    // Just change this line to use a different implementation
    authServiceInstance = new FirebaseAuthService();
  }
  return authServiceInstance;
}

/**
 * Export convenience methods that delegate to the auth service
 * This provides a cleaner API for consumers
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  signIn: (credentials: { email: string; password: string }) =>
    getAuthService().signInWithEmailAndPassword(credentials),

  /**
   * Sign up with email and password
   */
  signUp: (credentials: {
    email: string;
    password: string;
    displayName?: string;
  }) => getAuthService().signUpWithEmailAndPassword(credentials),

  /**
   * Sign in with Google
   */
  signInWithGoogle: () => getAuthService().signInWithGoogle(),

  /**
   * Sign out current user
   */
  signOut: () => getAuthService().signOut(),

  /**
   * Get current user
   */
  getCurrentUser: () => getAuthService().getCurrentUser(),

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged: (callback: (user: unknown) => void) =>
    getAuthService().onAuthStateChanged(callback),

  /**
   * Send password reset email
   */
  sendPasswordResetEmail: (email: string) =>
    getAuthService().sendPasswordResetEmail(email),

  /**
   * Update user profile
   */
  updateProfile: (data: { displayName?: string; photoURL?: string }) =>
    getAuthService().updateProfile(data),
};
