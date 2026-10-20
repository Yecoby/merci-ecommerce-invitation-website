/**
 * MERCI — Prisma Client singleton.
 *
 * Next.js hot-reload in development would create multiple PrismaClient instances
 * unless we use the global pattern below.
 * In production, a single instance is created and reused.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

