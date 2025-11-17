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
} from "@/shared/types/auth";
import { getAuthErrorMessage } from "@/shared/lib/auth/errors";

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
      providerData: user.providerData?.map((provider) => provider.providerId),
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
      throw new Error(getAuthErrorMessage(error));
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
      throw new Error(getAuthErrorMessage(error));
    }
  }

  async signInWithGoogle(): Promise<FirebaseUserData> {
    try {
      const provider = new GoogleAuthProvider();
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
      throw new Error(getAuthErrorMessage(error));
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error: unknown) {
      throw new Error(getAuthErrorMessage(error));
    }
  }

  getCurrentUser(): FirebaseUserData | null {
    return this.mapUser(this.auth.currentUser);
  }

  onAuthStateChanged(
    callback: (_user: FirebaseUserData | null) => void
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
      throw new Error(getAuthErrorMessage(error));
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
      throw new Error(getAuthErrorMessage(error));
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No user is currently signed in");
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await firebaseUpdatePassword(user, newPassword);
    } catch (error: unknown) {
      throw new Error(getAuthErrorMessage(error));
    }
  }

  async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return null;
      }
      return await user.getIdToken(forceRefresh);
    } catch (error: unknown) {
      throw new Error(getAuthErrorMessage(error));
    }
  }
}
