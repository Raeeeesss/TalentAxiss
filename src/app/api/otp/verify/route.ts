import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { identifier, type, otp } = await req.json();

    if (!identifier || !type || !otp) {
      return NextResponse.json({ error: "identifier, type, and otp required" }, { status: 400 });
    }

    const key = `otp:${type}:${identifier}`;
    const record = await prisma.verificationToken.findFirst({ where: { identifier: key, token: otp } });

    if (!record) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { identifier: key } });
      return NextResponse.json({ error: "OTP expired. Request a new one." }, { status: 400 });
    }

    // Consume token
    await prisma.verificationToken.deleteMany({ where: { identifier: key } });

    // Mark email as verified if this was an email OTP
    if (type === "email") {
      await prisma.user.updateMany({
        where: { email: identifier, emailVerified: null },
        data: { emailVerified: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("OTP verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
