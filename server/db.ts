import { PrismaClient } from "@prisma/client";

/** The main Prisma client instance for database access. */
const client = globalThis.prisma || new PrismaClient({ log: ["info", "error", "warn"] });

// Cache the Prisma instance globally during development
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

// Export guaranteed PrismaClient
export const prisma: PrismaClient = client;
