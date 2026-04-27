import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { parseCVWithAI } from "@/lib/ai";

async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  // Plain text
  if (name.endsWith(".txt")) {
    return await file.text();
  }

  // PDF — use pdf-parse
  if (name.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer   = Buffer.from(await file.arrayBuffer());
    const result   = await pdfParse(buffer);
    return result.text;
  }

  // DOCX — extract raw text from XML inside zip
  if (name.endsWith(".docx")) {
    const JSZip    = (await import("jszip")).default;
    const buffer   = await file.arrayBuffer();
    const zip      = await JSZip.loadAsync(buffer);
    const xml      = await zip.file("word/document.xml")?.async("text");
    if (!xml) throw new Error("Could not read DOCX file");
    return xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  // DOC / unknown — try reading as text
  return await file.text();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let text = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // File upload
      const formData = await req.formData();
      const file     = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      text = await extractText(file);
    } else {
      // Legacy: raw text in JSON body
      const body = await req.json();
      text = body.text || "";
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
    }

    const parsed = await parseCVWithAI(text);
    return NextResponse.json({ parsed });
  } catch (error) {
    console.error("CV parse error:", error);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
