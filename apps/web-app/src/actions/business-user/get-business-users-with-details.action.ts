/**
 * Get BusinessUsers With User Details Server Action
 *
 * This server action retrieves business users with full user information.
 * It combines BusinessUser data with User data for displaying employee lists.
 *
 * @module actions/business-user
 */

"use server";

import { prisma } from "db";
import { BusinessRole } from "@/core/domain/entities";

export interface BusinessUserWithDetails {
  id: number;
  userId: string;
  businessId: number;
  role: BusinessRole;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    pictureFullPath: string | null;
    phone: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface GetBusinessUsersWithDetailsInput {
  businessId: number;
  search?: string;
}

type GetBusinessUsersWithDetailsResult =
  | { success: true; businessUsers: BusinessUserWithDetails[] }
  | { success: false; error: string };

/**
 * Gets all business users with their user details for a specific business
 *
 * @param data - Input with businessId and optional search term
 * @returns Result object with business users including user details
 */
export async function getBusinessUsersWithDetails(
  data: GetBusinessUsersWithDetailsInput
): Promise<GetBusinessUsersWithDetailsResult> {
  try {
    const { businessId, search } = data;

    const businessUsers = await prisma.businessUser.findMany({
      where: {
        businessId,
        ...(search
          ? {
              user: {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            pictureFullPath: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      businessUsers: businessUsers as BusinessUserWithDetails[],
    };
  } catch (error) {
    console.error("Error in getBusinessUsersWithDetails:", error);
    return {
      success: false,
      error: "Failed to fetch business users with details",
    };
  }
}
