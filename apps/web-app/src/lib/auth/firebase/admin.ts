import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App;
let adminAuth: Auth;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 *
 * Required environment variables:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_CLIENT_EMAIL
 * - FIREBASE_PRIVATE_KEY
 */
function initializeFirebaseAdmin(): { app: App; auth: Auth } {
  if (!getApps().length) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
    adminAuth = getAuth(adminApp);
  } else {
    adminApp = getApps()[0];
    adminAuth = getAuth(adminApp);
  }

  return { app: adminApp, auth: adminAuth };
}

/**
 * Get Firebase Admin Auth instance
 */
export function getFirebaseAdminAuth(): Auth {
  if (!adminAuth) {
    const { auth } = initializeFirebaseAdmin();
    return auth;
  }
  return adminAuth;
}

/**
 * Verify Firebase ID token
 * Returns the decoded token with user information
 */
export async function verifyAuthToken(token: string): Promise<{
  uid: string;
  email: string | null;
}> {
  const auth = getFirebaseAdminAuth();
  const decodedToken = await auth.verifyIdToken(token);

  return {
    uid: decodedToken.uid,
    email: decodedToken.email || null,
  };
}
