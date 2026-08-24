import { NextRequest, NextResponse } from "next/server";
import { analyzeSkinWithClaude } from "@/lib/claude-commerce";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const mediaType = image.includes("image/png")
      ? ("image/png" as const)
      : ("image/jpeg" as const);

    const result = await analyzeSkinWithClaude(image, mediaType);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Skin analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyse skin. Please try again." },
      { status: 500 }
    );
  }
}
