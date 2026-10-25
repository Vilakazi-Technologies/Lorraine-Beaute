import { NextResponse } from "next/server";
import {
  resolveVilatechProvider,
  resolveVisionProvider,
  providerLabel,
  aiReady,
} from "@/lib/vilatech-ai/provider";
import { gatewayConfigured } from "@/lib/vilatech-ai/gateway-client";

export async function GET() {
  const chat = resolveVilatechProvider();
  const vision = resolveVisionProvider();
  return NextResponse.json({
    chatProvider: chat,
    visionProvider: vision,
    chatLabel: providerLabel(chat),
    gateway: gatewayConfigured()
      ? process.env.VILATECH_AI_GATEWAY_URL?.trim() || "https://vilatech-ai.vercel.app"
      : null,
    geminiModel:
      process.env.OPENROUTER_MODEL?.trim() ||
      process.env.OPENROUTER_VISION_MODEL?.trim() ||
      "google/gemini-2.5-flash-lite",
    ready: aiReady() && vision !== "none",
  });
}
