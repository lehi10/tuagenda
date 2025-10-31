import { Business, prisma, UserType } from "db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/business/user - Get businesses for the current user
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/auth token
    // For now, we'll get from a header (you can modify this based on your auth setup)
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get user with their type
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        type: true,
        businessUsers: {
          include: {
            business: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let businesses: Business[];

    // SuperAdmin: can see all businesses
    if (user.type === UserType.superadmin) {
      businesses = await prisma.business.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    // Admin or other roles: only see businesses where they have a relation
    else {
      businesses = user.businessUsers.map((bu) => bu.business);
    }

    // Transform to include role information
    const businessesWithRole = businesses.map((business) => {
      const businessUser = user.businessUsers.find(
        (bu) => bu.businessId === business.id
      );

      return {
        ...business,
        userRole: businessUser?.role || null,
      };
    });

    return NextResponse.json(businessesWithRole);
  } catch (error) {
    console.error("Error fetching user businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}
