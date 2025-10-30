import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";
import {
  IAuthService,
  FirebaseUserData,
  EmailPasswordCredentials,
  SignUpCredentials,
} from "../types";

/**
 * Firebase implementation of the AuthService
 * All Firebase-specific code is isolated here
 */
export class FirebaseAuthService implements IAuthService {
  private auth = getFirebaseAuth();

  /**
   * Convert Firebase User to our FirebaseUserData type
   */
  private mapUser(user: User | null): FirebaseUserData | null {
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }

  async signInWithEmailAndPassword(
    credentials: EmailPasswordCredentials
  ): Promise<FirebaseUserData> {
    try {
      const userCredential = await firebaseSignIn(
        this.auth,
        credentials.email,
        credentials.password
      );
      const authUser = this.mapUser(userCredential.user);
      if (!authUser) {
        throw new Error("Failed to authenticate user");
      }
      return authUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Sign in failed: ${error.message}`);
      }
      throw new Error("Sign in failed: Unknown error");
    }
  }

  async signUpWithEmailAndPassword(
    credentials: SignUpCredentials
  ): Promise<FirebaseUserData> {
    try {
      const userCredential = await firebaseSignUp(
        this.auth,
        credentials.email,
        credentials.password
      );

      // Update profile with display name if provided
      if (credentials.displayName) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName: credentials.displayName,
        });
      }

      const authUser = this.mapUser(userCredential.user);
      if (!authUser) {
        throw new Error("Failed to create user");
      }
      return authUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Sign up failed: ${error.message}`);
      }
      throw new Error("Sign up failed: Unknown error");
    }
  }

  async signInWithGoogle(): Promise<FirebaseUserData> {
    try {
      const provider = new GoogleAuthProvider();
      // Optional: Add custom parameters
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(this.auth, provider);
      const authUser = this.mapUser(result.user);
      if (!authUser) {
        throw new Error("Failed to authenticate with Google");
      }
      return authUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Google sign in failed: ${error.message}`);
      }
      throw new Error("Google sign in failed: Unknown error");
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Sign out failed: ${error.message}`);
      }
      throw new Error("Sign out failed: Unknown error");
    }
  }

  getCurrentUser(): FirebaseUserData | null {
    return this.mapUser(this.auth.currentUser);
  }

  onAuthStateChanged(
    callback: (user: FirebaseUserData | null) => void
  ): () => void {
    const unsubscribe = firebaseOnAuthStateChanged(this.auth, (user) => {
      callback(this.mapUser(user));
    });
    return unsubscribe;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseSendPasswordReset(this.auth, email);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Password reset failed: ${error.message}`);
      }
      throw new Error("Password reset failed: Unknown error");
    }
  }

  async updateProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in");
      }
      await firebaseUpdateProfile(user, data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Profile update failed: ${error.message}`);
      }
      throw new Error("Profile update failed: Unknown error");
    }
  }

  /**
   * Change user password
   * Requires re-authentication with current password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No user is currently signed in");
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await firebaseUpdatePassword(user, newPassword);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific Firebase errors
        if (error.message.includes("wrong-password")) {
          throw new Error("Current password is incorrect");
        }
        if (error.message.includes("weak-password")) {
          throw new Error("New password is too weak");
        }
        throw new Error(`Password change failed: ${error.message}`);
      }
      throw new Error("Password change failed: Unknown error");
    }
  }
}
