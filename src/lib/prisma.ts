import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set");

  // Strip channel_binding — HTTP connections don't use TLS channel binding
  const url = raw
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require&", "?")
    .replace("?channel_binding=require", "");

  // PrismaNeonHttp takes the connection string directly (no neon() call needed)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter: new PrismaNeonHttp(url, {} as any) });
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = createClient());
