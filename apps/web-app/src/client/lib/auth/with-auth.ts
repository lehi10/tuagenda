import { getAuth } from "firebase/auth";

/**
 * Helper to automatically include authentication token in server action calls
 *
 * Usage:
 * ```typescript
 * import { withAuth } from "@/client/lib/auth/with-auth";
 *
 * const result = await withAuth(getUserByIdAction, { userId: '123' });
 * ```
 *
 * The token is automatically added as `_token` property in the data object
 * Firebase caches tokens internally, so this is very fast (1-2ms)
 */
export async function withAuth<T>(
  action: (data: any) => Promise<T>,
  data?: any
): Promise<T> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("No estás autenticado. Por favor inicia sesión.");
  }

  return action({ ...data, _token: token });
}
