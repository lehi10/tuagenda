import type { UserProps } from "@/server/core/domain/entities/User";

/**
 * User authentication data from database
 * This is the user object we use throughout the app after authentication
 */
export type User = UserProps;

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
  providerData?: string[];
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
 * Uses database User type instead of Firebase user
 */
export interface AuthState {
  user: User | null;
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
    _credentials: EmailPasswordCredentials
  ): Promise<FirebaseUserData>;

  /**
   * Sign up with email and password
   * Returns Firebase user data only
   */
  signUpWithEmailAndPassword(
    _credentials: SignUpCredentials
  ): Promise<FirebaseUserData>;

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
  onAuthStateChanged(
    _callback: (_user: FirebaseUserData | null) => void
  ): () => void;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(_email: string): Promise<void>;

  /**
   * Update user profile in Firebase
   */
  updateProfile(_data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void>;

  /**
   * Change user password
   * Requires re-authentication with current password
   */
  changePassword?(
    _currentPassword: string,
    _newPassword: string
  ): Promise<void>;

  /**
   * Get ID token for current user
   * Token is used for authenticated server requests
   */
  getIdToken(_forceRefresh?: boolean): Promise<string | null>;
}
