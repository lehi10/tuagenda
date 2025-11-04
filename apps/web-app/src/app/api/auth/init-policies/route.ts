/**
 * Initialize Authorization Policies API Route
 *
 * This route initializes the default authorization policies
 * for the application. Should be called during application setup
 * or when resetting permissions.
 */

import { NextResponse } from "next/server";
import { getAuthorizationService } from "@/lib/auth/authorization";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const authService = getAuthorizationService();

    // Initialize default policies
    await authService.initializeDefaultPolicies();

    logger.info(
      "InitPoliciesRoute",
      "system",
      "Authorization policies initialized successfully"
    );

    return NextResponse.json({
      success: true,
      message: "Authorization policies initialized successfully",
    });
  } catch (error) {
    logger.error(
      "InitPoliciesRoute",
      "system",
      `Failed to initialize policies: ${error instanceof Error ? error.message : String(error)}`
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize authorization policies",
      },
      { status: 500 }
    );
  }
}
