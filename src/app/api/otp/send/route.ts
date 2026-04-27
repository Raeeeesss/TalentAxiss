import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  try {
    const { identifier, type } = await req.json();

    if (!identifier || !type) {
      return NextResponse.json({ error: "identifier and type required" }, { status: 400 });
    }

    const otp     = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const key     = `otp:${type}:${identifier}`;

    await prisma.verificationToken.deleteMany({ where: { identifier: key } });
    await prisma.verificationToken.create({ data: { identifier: key, token: otp, expires } });

    console.log(`[OTP] ${type} → ${identifier} : ${otp}`);

    // Return OTP directly — Supabase/real sending will be enabled after domain setup
    return NextResponse.json({ success: true, otp });
  } catch (err: any) {
    console.error("OTP error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Failed to generate OTP" }, { status: 500 });
  }
}
