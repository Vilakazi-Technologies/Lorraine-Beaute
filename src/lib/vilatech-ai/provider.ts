import { VILATECH_AI, VILATECH_AI_MODEL } from "@/lib/brand";
import { gatewayConfigured, useVilatechAiGateway } from "@/lib/vilatech-ai/gateway-client";

export type VilatechAiProvider = "gateway" | "openrouter" | "anthropic" | "none";

/** Uses vilatech-ai.vercel.app OpenRouter (Gemini) when local key absent — same as ViLATECH AI chat. */
export function resolveVilatechProvider(): VilatechAiProvider {
  if (useVilatechAiGateway()) return "gateway";
  if (process.env.OPENROUTER_API_KEY?.trim()) return "openrouter";
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  return "none";
}

export function resolveVisionProvider(): VilatechAiProvider {
  if (useVilatechAiGateway()) return "gateway";
  if (process.env.OPENROUTER_API_KEY?.trim()) return "openrouter";
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  return "none";
}

export function providerLabel(provider: VilatechAiProvider): string {
  switch (provider) {
    case "gateway":
    case "openrouter":
      return VILATECH_AI_MODEL;
    case "anthropic":
      return `${VILATECH_AI} (Claude vision)`;
    default:
      return VILATECH_AI;
  }
}

export function aiReady(): boolean {
  return resolveVilatechProvider() !== "none" || gatewayConfigured();
}
