import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { sendOtpSms } from "@/lib/sms";

function generateOtp(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000));
}

export async function POST(req: NextRequest) {
  try {
    const { identifier, type } = await req.json() as { identifier: string; type: string };

    if (!identifier || !type) {
      return NextResponse.json({ error: "identifier and type required" }, { status: 400 });
    }

    const otp     = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const key     = `otp:${type}:${identifier}`;

    await prisma.verificationToken.deleteMany({ where: { identifier: key } });
    await prisma.verificationToken.create({ data: { identifier: key, token: otp, expires } });

    if (type === "email") sendOtpEmail(identifier, otp).catch(() => {});
    if (type === "phone") sendOtpSms(identifier, otp).catch(() => {});

    return NextResponse.json({ success: true, otp });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send OTP";
    console.error("OTP send error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
