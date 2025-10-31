import { prisma } from "db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/business/[id] - Get a single business
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const idParam = params.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}

// PUT /api/business/[id] - Update a business
export async function PUT(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const idParam = params.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id },
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // If slug is being updated, check if it's already taken by another business
    if (body.slug && body.slug !== existingBusiness.slug) {
      const slugExists = await prisma.business.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A business with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Update the business
    const business = await prisma.business.update({
      where: { id },
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
        status: body.status,
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

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}

// DELETE /api/business/[id] - Delete a business
export async function DELETE(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const idParam = params.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id },
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Delete the business
    await prisma.business.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Business deleted successfully" });
  } catch (error) {
    console.error("Error deleting business:", error);
    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}
