/**
 * Business API Routes - Single Business Operations
 *
 * REFACTORED: Now uses hexagonal architecture with use cases.
 *
 * @module app/api/business/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import {
  GetBusinessUseCase,
  UpdateBusinessUseCase,
  DeleteBusinessUseCase,
} from "@/core/application/use-cases/business";
import { PrismaBusinessRepository } from "@/infrastructure/repositories";

// GET /api/business/[id] - Get a single business
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const businessRepository = new PrismaBusinessRepository();
    const getBusinessUseCase = new GetBusinessUseCase(businessRepository);

    const result = await getBusinessUseCase.execute({ id });

    if (result.success && result.business) {
      return NextResponse.json(result.business.toObject());
    }

    return NextResponse.json({ error: result.error }, { status: 404 });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}

// PUT /api/business/[id] - Update a business
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    const businessRepository = new PrismaBusinessRepository();
    const updateBusinessUseCase = new UpdateBusinessUseCase(businessRepository);

    const result = await updateBusinessUseCase.execute({ id, ...body });

    if (result.success && result.business) {
      return NextResponse.json(result.business.toObject());
    }

    const status = result.error?.includes("not found")
      ? 404
      : result.error?.includes("already exists")
        ? 409
        : 400;

    return NextResponse.json({ error: result.error }, { status });
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}

// DELETE /api/business/[id] - Delete a business
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const businessRepository = new PrismaBusinessRepository();
    const deleteBusinessUseCase = new DeleteBusinessUseCase(businessRepository);

    const result = await deleteBusinessUseCase.execute({ id });

    if (result.success) {
      return NextResponse.json({ message: "Business deleted successfully" });
    }

    const status = result.error?.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  } catch (error) {
    console.error("Error deleting business:", error);
    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}
