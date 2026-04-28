/**
 * Prisma Client Singleton
 *
 * This module ensures only one instance of Prisma Client is created throughout
 * the application lifecycle. This is especially important in development to avoid
 * hitting connection limits during hot reloading.
 *
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from '@prisma/client';

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
function createPrismaClient() {
  const isDev = process.env.NODE_ENV === 'development';

  const client = new PrismaClient({
    log: isDev
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'warn' },
        ]
      : [{ emit: 'stdout', level: 'error' }],
  });

  if (isDev) {
    client.$on('query', (e) => {
      const SLOW_THRESHOLD_MS = 200;
      const op = e.query.match(/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i)?.[1] ?? 'QUERY';
      const table = e.query.match(/"public"\."(\w+)"/)?.[1] ?? '?';
      const ms = e.duration;
      const isSlow = ms >= SLOW_THRESHOLD_MS;

      if (isSlow) {
        console.log(`prisma:query \x1b[31m⚠ SLOW (${ms}ms)\x1b[0m \x1b[36m${op}\x1b[0m \x1b[33m${table}\x1b[0m`);
        console.log(`  SQL: ${e.query}`);
        console.log(`  params: ${e.params}`);
      } else {
        const params = (() => {
          try {
            const parsed = JSON.parse(e.params) as unknown[];
            return parsed.map((p) => (typeof p === 'string' && p.length > 20 ? `${p.slice(0, 20)}…` : p));
          } catch {
            return e.params;
          }
        })();
        console.log(`prisma:query \x1b[36m${op}\x1b[0m \x1b[33m${table}\x1b[0m ${JSON.stringify(params)} \x1b[90m(${ms}ms)\x1b[0m`);
      }
    });
  }

  return client;
}

export const prisma = global.prisma ?? createPrismaClient();

// Store instance in global object during development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { Prisma, PrismaClient } from '@prisma/client';
export type {
  User,
  Service,
  Appointment,
  BusinessUser,
  EmployeeService,
  Business,
  ServiceCategory,
} from '@prisma/client';
