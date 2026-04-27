import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set.");

  // Strip channel_binding — not supported by @neondatabase/serverless Pool
  const url = connectionString
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require&", "?")
    .replace("?channel_binding=require", "");

  const pool    = new Pool({ connectionString: url });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(pool as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
