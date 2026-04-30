import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set");

  // Remove channel_binding — not supported by the Neon HTTP driver
  let url = raw;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    url = u.toString();
  } catch {
    // keep raw if URL fails to parse
  }

  return new PrismaClient({ adapter: new PrismaNeon(neon(url)) });
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = createClient());
