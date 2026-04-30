import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { identifier, type, otp } = await req.json() as {
      identifier: string;
      type: string;
      otp: string;
    };

    if (!identifier || !type || !otp) {
      return NextResponse.json({ error: "identifier, type, and otp required" }, { status: 400 });
    }

    const key = `otp:${type}:${identifier}`;

    const record = await prisma.verificationToken.findFirst({
      where: { identifier: key, token: otp },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { identifier: key } });
      return NextResponse.json({ error: "OTP expired — request a new one" }, { status: 400 });
    }

    await prisma.verificationToken.deleteMany({ where: { identifier: key } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("OTP verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
