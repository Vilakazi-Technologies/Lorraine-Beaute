import { NextResponse } from "next/server";
import { resolveVilatechProvider, resolveVisionProvider, providerLabel } from "@/lib/vilatech-ai/provider";

export async function GET() {
  const chat = resolveVilatechProvider();
  const vision = resolveVisionProvider();
  return NextResponse.json({
    chatProvider: chat,
    visionProvider: vision,
    chatLabel: providerLabel(chat),
    geminiModel:
      process.env.OPENROUTER_MODEL?.trim() ||
      process.env.OPENROUTER_VISION_MODEL?.trim() ||
      "google/gemini-2.5-flash-lite",
    ready: chat !== "none" && vision !== "none",
  });
}
