/**
 * Singleton PrismaClient.
 *
 * En dev, Next.js recharge à chaud les modules : sans singleton, on crée un
 * nouveau client à chaque hot reload, et on épuise rapidement le pool de
 * connexions Postgres. On stocke donc le client sur `globalThis` en dev.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
