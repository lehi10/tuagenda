/**
 * Seed Initial Policies
 *
 * Script to initialize default RBAC policies for MANAGER and EMPLOYEE roles.
 * Run this after migrations to set up the authorization system.
 */

import { PrismaClient } from "@prisma/client";
import { AuthorizationService } from "./authorization-service";

async function seedPolicies() {
  const prisma = new PrismaClient();

  try {
    console.log("🌱 Seeding Casbin policies...");

    const authService = AuthorizationService.getInstance(prisma);

    // Initialize default policies
    await authService.initializeDefaultPolicies();

    console.log("✅ Default policies seeded successfully!");
    console.log("\nPolicies created:");
    console.log("📋 MANAGER role:");
    console.log("  - Business: read, update");
    console.log("  - Employee: MANAGE (full CRUD)");
    console.log("  - Appointment: MANAGE (full CRUD)");
    console.log("  - Settings: read, update");
    console.log("\n📋 EMPLOYEE role:");
    console.log("  - Business: read");
    console.log("  - Employee: read");
    console.log("  - Appointment: create, read, update");
    console.log("  - Settings: read");
    console.log("\nNote: MANAGE action = wildcard for all CRUD operations");
  } catch (error) {
    console.error("❌ Error seeding policies:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedPolicies()
    .then(() => {
      console.log("\n✨ Policy seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed policies:", error);
      process.exit(1);
    });
}

export { seedPolicies };
