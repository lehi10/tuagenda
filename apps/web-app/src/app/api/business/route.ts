/**
 * Business API Routes
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module app/api/business
 */

import { NextRequest, NextResponse } from "next/server";
import {
  ListBusinessesUseCase,
  CreateBusinessUseCase,
} from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

// GET /api/business - List all businesses
export async function GET(request: NextRequest) {
  try {
    const businessRepository = new PrismaBusinessRepository();
    const listBusinessesUseCase = new ListBusinessesUseCase(businessRepository);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      search: searchParams.get("search") || undefined,
      city: searchParams.get("city") || undefined,
      country: searchParams.get("country") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
    };

    const result = await listBusinessesUseCase.execute(filters);

    if (result.success) {
      return NextResponse.json({
        businesses: result.businesses?.map((b) => b.toObject()),
        total: result.total,
      });
    }

    return NextResponse.json({ error: result.error }, { status: 500 });
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

    const businessRepository = new PrismaBusinessRepository();
    const createBusinessUseCase = new CreateBusinessUseCase(businessRepository);

    const result = await createBusinessUseCase.execute(body);

    if (result.success && result.business) {
      return NextResponse.json(result.business.toObject(), { status: 201 });
    }

    return NextResponse.json(
      { error: result.error },
      { status: result.error?.includes("already exists") ? 409 : 400 }
    );
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
