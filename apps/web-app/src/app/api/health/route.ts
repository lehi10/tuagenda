import { prisma } from "db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Intenta conectarse y hacer una consulta simple
    const userCount = await prisma.user.count();
    const businessCount = await prisma.business.count();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      tables: {
        users: userCount,
        business: businessCount,
      },
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
