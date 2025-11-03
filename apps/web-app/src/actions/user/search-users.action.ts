/**
 * Search Users Server Action
 *
 * This server action searches for users by email or name.
 * Used for adding employees to a business.
 *
 * @module actions/user
 */

"use server";

import { prisma } from "@/lib/db/prisma";

export interface SearchUsersInput {
  search: string;
  limit?: number;
}

export interface UserSearchResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureFullPath: string | null;
}

type SearchUsersResult =
  | { success: true; users: UserSearchResult[] }
  | { success: false; error: string };

/**
 * Search for users by email or name
 *
 * @param data - Input with search term and optional limit
 * @returns Result object with matching users
 */
export async function searchUsers(
  data: SearchUsersInput
): Promise<SearchUsersResult> {
  try {
    const { search, limit = 10 } = data;

    if (!search || search.trim().length < 2) {
      return {
        success: true,
        users: [],
      };
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        pictureFullPath: true,
      },
      take: limit,
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return {
      success: false,
      error: "Failed to search users",
    };
  }
}
