import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { parseCVWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "CV text is required" }, { status: 400 });
    }

    const parsed = await parseCVWithAI(text);
    return NextResponse.json({ parsed });
  } catch (error) {
    console.error("CV parse error:", error);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
