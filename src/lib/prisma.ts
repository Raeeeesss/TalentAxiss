import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL environment variable is not set.");

  // Strip parameters unsupported by pg
  const connectionString = raw
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require&", "?")
    .replace("?channel_binding=require", "");

  const pool    = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  // PrismaPg satisfies the Prisma v7 driver adapter interface
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
