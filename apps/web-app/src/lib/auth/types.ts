import type { User } from "@/lib/db/prisma";

/**
 * User authentication data from database
 * This is the user object we use throughout the app after authentication
 */
export type AuthUser = User;

/**
 * Firebase user data (internal use only)
 * Used internally by auth service, not exposed to the app
 */
export interface FirebaseUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Credentials for email/password authentication
 */
export interface EmailPasswordCredentials {
  email: string;
  password: string;
}

/**
 * Credentials for sign up
 */
export interface SignUpCredentials extends EmailPasswordCredentials {
  displayName?: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Abstract authentication service interface
 * This allows us to swap implementations (Firebase, Auth0, custom, etc.)
 * Returns Firebase user data (not full app user data)
 */
export interface IAuthService {
  /**
   * Sign in with email and password
   * Returns Firebase user data only
   */
  signInWithEmailAndPassword(
    credentials: EmailPasswordCredentials
  ): Promise<FirebaseUserData>;

  /**
   * Sign up with email and password
   * Returns Firebase user data only
   */
  signUpWithEmailAndPassword(credentials: SignUpCredentials): Promise<FirebaseUserData>;

  /**
   * Sign in with Google
   * Returns Firebase user data only
   */
  signInWithGoogle(): Promise<FirebaseUserData>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Get current authenticated user from Firebase
   * Returns Firebase user data only
   */
  getCurrentUser(): FirebaseUserData | null;

  /**
   * Subscribe to Firebase authentication state changes
   * Callback receives Firebase user data only
   */
  onAuthStateChanged(callback: (user: FirebaseUserData | null) => void): () => void;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Update user profile in Firebase
   */
  updateProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void>;
}
