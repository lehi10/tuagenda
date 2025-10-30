/**
 * Prisma Client Singleton
 *
 * This module ensures only one instance of Prisma Client is created throughout
 * the application lifecycle. This is especially important in development to avoid
 * hitting connection limits during hot reloading.
 *
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

// Import from the generated Prisma client in the db package
import { PrismaClient } from "../../../../../packages/db/generated/prisma";

/**
 * Global type declaration for Prisma Client instance
 * This allows us to store the instance on the global object
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Singleton instance of Prisma Client
 *
 * In development: Uses global object to persist instance across hot reloads
 * In production: Creates a single instance
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Store instance in global object during development
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * Export Prisma types for use throughout the application
 * These types are automatically generated from your Prisma schema
 */
// Export types from the generated Prisma client
export type {
  User,
  Business,
  UserStatus,
  UserType,
  BusinessStatus,
} from "../../../../../packages/db/generated/prisma";
