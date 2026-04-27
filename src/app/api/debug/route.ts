import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    DATABASE_URL_length: process.env.DATABASE_URL?.length ?? 0,
    DATABASE_URL_starts: process.env.DATABASE_URL?.slice(0, 40) ?? "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
