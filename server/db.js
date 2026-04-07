import "dotenv/config";
import { PrismaClient } from "./db/generated/prisma/index.js";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Ensures a single PrismaClient instance is used throughout the app.
 */
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
