/**
 * User authentication data
 */
export interface AuthUser {
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
 */
export interface IAuthService {
  /**
   * Sign in with email and password
   */
  signInWithEmailAndPassword(
    credentials: EmailPasswordCredentials
  ): Promise<AuthUser>;

  /**
   * Sign up with email and password
   */
  signUpWithEmailAndPassword(credentials: SignUpCredentials): Promise<AuthUser>;

  /**
   * Sign in with Google
   */
  signInWithGoogle(): Promise<AuthUser>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null;

  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Update user profile
   */
  updateProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void>;
}
