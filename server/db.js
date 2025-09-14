import { PrismaClient } from "@prisma/client";

/**
 * Ensures a single PrismaClient instance is used throughout the app.
 */
const globalForPrisma = globalThis;

/**
 * The main Prisma client instance for database access.
 * @type {PrismaClient}
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["info", "error", "warn"],
  });

// Cache the Prisma instance globally during development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
