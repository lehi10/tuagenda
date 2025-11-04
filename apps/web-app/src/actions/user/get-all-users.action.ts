/**
 * Get All Users Server Action
 *
 * This server action retrieves all users from the system with comprehensive filtering.
 * More complete than searchUsers - includes type, status, and pagination support.
 *
 * @module actions/user
 */

"use server";

import { prisma } from "db";
import { logger } from "@/lib/logger";
import { UserType, UserStatus } from "@/core/domain/entities/User";
import type { Prisma } from "db";

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  countryCode: string | null;
  pictureFullPath: string | null;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllUsersResult {
  success: boolean;
  users?: UserListItem[];
  total?: number;
  error?: string;
}

export interface GetAllUsersFilters {
  search?: string;
  type?: UserType;
  status?: UserStatus;
  limit?: number;
  offset?: number;
}

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

/**
 * Get all users from the system with optional filtering
 *
 * @param filters - Optional filters for search, type, status, pagination
 * @returns Result with users array and total count
 */
export async function getAllUsers(
  filters?: GetAllUsersFilters
): Promise<GetAllUsersResult> {
  try {
    logger.info(
      "GetAllUsersAction",
      "system",
      `Fetching users with filters: ${JSON.stringify(filters || {})}`
    );

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    // Search filter (email, firstName, lastName)
    if (filters?.search && filters.search.trim().length > 0) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // Type filter
    if (filters?.type) {
      where.type = filters.type;
    }

    // Status filter
    if (filters?.status) {
      where.status = filters.status;
    }

    // Get total count with filters
    const total = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        countryCode: true,
        pictureFullPath: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: filters?.limit || DEFAULT_LIMIT,
      skip: filters?.offset || DEFAULT_OFFSET,
    });

    logger.info(
      "GetAllUsersAction",
      "system",
      `Successfully fetched ${users.length} users out of ${total} total`
    );

    return {
      success: true,
      users,
      total,
    };
  } catch (error) {
    logger.error(
      "GetAllUsersAction",
      "system",
      `Error fetching users: ${error instanceof Error ? error.message : String(error)}`
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred fetching users",
    };
  }
}
