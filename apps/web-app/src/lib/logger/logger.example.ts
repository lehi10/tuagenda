/**
 * Example usage of the Logger class
 *
 * This file demonstrates how to use the Logger in your application.
 * You can delete this file once you're familiar with the Logger usage.
 */

import { Logger, logger } from "./logger";

// Example 1: Using the singleton instance directly
function exampleWithSingleton() {
  const log = Logger.getInstance();

  // Log info
  log.info("AuthService", "user-123", "User logged in successfully");

  // Log warning
  log.warning("PaymentService", "user-456", "Payment method is expiring soon");

  // Log error
  log.error(
    "BookingService",
    "user-789",
    "Failed to create booking: Invalid date"
  );

  // Log fatal error
  log.fatal("DatabaseService", "anonymous", "Database connection lost");
}

// Example 2: Using the exported logger instance (recommended)
function exampleWithExportedInstance() {
  // Log info without user (defaults to 'anonymous')
  logger.info("PublicAPI", undefined, "Public endpoint accessed");

  // Log with specific user
  logger.info("UserService", "user-abc", "User profile updated");

  // Log error in appointment creation
  logger.error(
    "createAppointment",
    "user-xyz",
    "Failed to create appointment: Service not available"
  );
}

// Example 3: Usage in a real service
class AppointmentService {
  async createAppointment(userId: string, data: unknown) {
    try {
      logger.info(
        "AppointmentService.createAppointment",
        userId,
        "Starting appointment creation"
      );

      // ... your business logic here ...

      logger.info(
        "AppointmentService.createAppointment",
        userId,
        "Appointment created successfully"
      );
    } catch (error) {
      logger.error(
        "AppointmentService.createAppointment",
        userId,
        `Failed to create appointment: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
}

// Example 4: Usage in an API route
async function apiRouteExample(request: Request) {
  const userId = "user-from-session"; // Get from session/auth

  try {
    logger.info(
      "API.appointments.POST",
      userId,
      "Received appointment creation request"
    );

    // ... process request ...

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    logger.fatal(
      "API.appointments.POST",
      userId,
      "Critical error in appointment creation"
    );
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export {
  exampleWithSingleton,
  exampleWithExportedInstance,
  AppointmentService,
  apiRouteExample,
};
