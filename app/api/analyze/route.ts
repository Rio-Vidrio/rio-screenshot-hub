import { NextRequest, NextResponse } from "next/server";
import { analyzeScreenshot } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64 || !mediaType) {
      return NextResponse.json(
        { error: "Missing imageBase64 or mediaType" },
        { status: 400 }
      );
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(mediaType)) {
      return NextResponse.json(
        { error: "Unsupported media type" },
        { status: 400 }
      );
    }

    const result = await analyzeScreenshot(
      imageBase64,
      mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp"
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
