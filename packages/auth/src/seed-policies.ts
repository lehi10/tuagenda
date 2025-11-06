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
    console.log("  - Full access to business (read, update)");
    console.log("  - Full access to employees (CRUD)");
    console.log("  - Full access to appointments (CRUD)");
    console.log("  - Full access to settings (read, update)");
    console.log("\n📋 EMPLOYEE role:");
    console.log("  - Read access to business");
    console.log("  - Read access to employees");
    console.log("  - Create, read, update appointments");
    console.log("  - Read access to settings");
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
