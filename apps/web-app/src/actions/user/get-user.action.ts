/**
 * Get User Server Action
 *
 * Fetches user data from PostgreSQL database by Firebase UID.
 * This is used after Firebase authentication to get the full user profile.
 *
 * @module actions/user
 */

"use server";

import { prisma } from "@/lib/db/prisma";
import type { User } from "@/lib/db/prisma";

/**
 * Result type for the get user action
 */
type GetUserResult =
  | { success: true; user: User }
  | { success: false; error: string };

/**
 * Fetches user data from database by Firebase UID
 *
 * @param firebaseUid - The Firebase UID of the user
 * @returns Result object with user data or error message
 *
 * @example
 * ```typescript
 * const result = await getUserById(firebaseUser.uid);
 *
 * if (result.success) {
 *   console.log('User data:', result.user);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getUserById(firebaseUid: string): Promise<GetUserResult> {
  console.log("[SERVER ACTION] 🔍 Getting user from database:", firebaseUid);

  try {
    const user = await prisma.user.findUnique({
      where: { id: firebaseUid },
    });

    if (!user) {
      console.log("[SERVER ACTION] ❌ User not found in database");
      return {
        success: false,
        error: "User not found in database",
      };
    }

    console.log("[SERVER ACTION] ✅ User found:", user.email);

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error(
      "[SERVER ACTION] 💥 Error fetching user from database:",
      error
    );
    return {
      success: false,
      error: "Failed to fetch user data. Please try again.",
    };
  }
}
