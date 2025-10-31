import { prisma } from "db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/business - List all businesses
export async function GET(request: NextRequest) {
  try {
    const businesses = await prisma.business.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}

// POST /api/business - Create a new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "slug",
      "email",
      "phone",
      "address",
      "city",
      "country",
      "timeZone",
      "locale",
      "currency",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { slug: body.slug },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "A business with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the business
    const business = await prisma.business.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || null,
        domain: body.domain || null,
        logo: body.logo || null,
        coverImage: body.coverImage || null,
        timeZone: body.timeZone,
        locale: body.locale,
        currency: body.currency,
        status: body.status || "active",
        email: body.email,
        phone: body.phone,
        website: body.website || null,
        address: body.address,
        city: body.city,
        state: body.state || null,
        country: body.country,
        postalCode: body.postalCode || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
