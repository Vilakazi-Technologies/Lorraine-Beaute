import { VILATECH_AI_MODEL } from "@/lib/brand";

const DEFAULT_GATEWAY = "https://vilatech-ai.vercel.app";

export function gatewayConfigured(): boolean {
  const secret = process.env.VILATECH_STORE_SECRET?.trim();
  const url = process.env.VILATECH_AI_GATEWAY_URL?.trim() || DEFAULT_GATEWAY;
  return Boolean(secret && url);
}

export function useVilatechAiGateway(): boolean {
  if (process.env.VILATECH_AI_GATEWAY_URL?.trim() === "0") return false;
  if (process.env.OPENROUTER_API_KEY?.trim()) return false;
  return gatewayConfigured();
}

function gatewayUrl(): string {
  return process.env.VILATECH_AI_GATEWAY_URL?.trim() || DEFAULT_GATEWAY;
}

function gatewaySecret(): string {
  const secret = process.env.VILATECH_STORE_SECRET?.trim();
  if (!secret) throw new Error("VILATECH_STORE_SECRET missing");
  return secret;
}

export async function gatewayCompleteJson(
  system: string,
  user: string
): Promise<{ raw: string; poweredBy: string }> {
  const res = await fetch(`${gatewayUrl()}/api/store/complete-json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vilatech-store-secret": gatewaySecret(),
    },
    body: JSON.stringify({ system, user }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gateway JSON failed");
  return { raw: data.raw, poweredBy: data.poweredBy ?? VILATECH_AI_MODEL };
}

export async function gatewayCompleteVisionJson(
  system: string,
  user: string,
  imageDataUrl: string
): Promise<{ raw: string; poweredBy: string }> {
  const res = await fetch(`${gatewayUrl()}/api/store/complete-vision-json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vilatech-store-secret": gatewaySecret(),
    },
    body: JSON.stringify({ system, user, imageDataUrl }),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      typeof data.error === "string" ? data.error : `Gateway vision failed (${res.status})`;
    throw new Error(msg);
  }
  return { raw: data.raw, poweredBy: data.poweredBy ?? VILATECH_AI_MODEL };
}
