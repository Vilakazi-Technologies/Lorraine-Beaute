export type VilatechAiProvider = "xavani" | "openrouter" | "anthropic" | "none";

/** Lorraine demo: Gemini via OpenRouter (same as vilatech-ai demo). */
export function resolveVilatechProvider(): VilatechAiProvider {
  if (process.env.OPENROUTER_API_KEY?.trim()) return "openrouter";
  if (process.env.XAVANI_API_KEY?.trim() && process.env.XAVANI_BASE_URL?.trim()) {
    return "xavani";
  }
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  return "none";
}

export function resolveVisionProvider(): VilatechAiProvider {
  if (process.env.OPENROUTER_API_KEY?.trim()) return "openrouter";
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  return "none";
}

export function providerLabel(provider: VilatechAiProvider): string {
  switch (provider) {
    case "xavani":
      return "ViLATECH AI (Xavani)";
    case "openrouter":
      return "ViLATECH AI · Gemini 2.5 Flash";
    case "anthropic":
      return "ViLATECH AI (Claude)";
    default:
      return "ViLATECH AI";
  }
}
