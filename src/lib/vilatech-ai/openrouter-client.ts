const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function apiKey(): string {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) throw new Error("OPENROUTER_UNAVAILABLE");
  return key;
}

const DEFAULT_GEMINI = "google/gemini-2.5-flash-lite";

function chatModel(): string {
  return (
    process.env.OPENROUTER_MODEL?.trim() ||
    process.env.OPENROUTER_CHAT_MODEL?.trim() ||
    DEFAULT_GEMINI
  );
}

function visionModel(): string {
  return (
    process.env.OPENROUTER_VISION_MODEL?.trim() ||
    process.env.OPENROUTER_MODEL?.trim() ||
    DEFAULT_GEMINI
  );
}

function storeReferer(): string {
  return (
    process.env.NEXT_PUBLIC_STORE_URL?.trim() ||
    process.env.APP_ORIGIN?.trim() ||
    "https://lorraine-beauty-store.vercel.app"
  );
}

async function post(body: unknown): Promise<Response> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": storeReferer(),
      "X-Title": "Lorraine Beaute - ViLATECH AI",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err.slice(0, 200)}`);
  }
  return res;
}

function extractText(data: {
  choices?: { message?: { content?: string | unknown } }[];
}): string {
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return "";
}

export async function openRouterCompleteText(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const res = await post({
    model: chatModel(),
    max_tokens: 900,
    messages: [{ role: "system", content: system }, ...messages],
  });
  const data = (await res.json()) as Parameters<typeof extractText>[0];
  const text = extractText(data);
  if (!text.trim()) throw new Error("EMPTY_OPENROUTER_RESPONSE");
  return text.trim();
}

export async function openRouterCompleteJson(
  system: string,
  userContent: string
): Promise<string> {
  const res = await post({
    model: chatModel(),
    max_tokens: 1200,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: userContent },
    ],
  });
  const data = (await res.json()) as Parameters<typeof extractText>[0];
  const text = extractText(data);
  if (!text.trim()) throw new Error("EMPTY_OPENROUTER_JSON");
  return text.trim();
}

export async function openRouterVisionJson(
  system: string,
  textPrompt: string,
  imageDataUrl: string
): Promise<string> {
  const res = await post({
    model: visionModel(),
    max_tokens: 1400,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text: textPrompt },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      },
    ],
  });
  const data = (await res.json()) as Parameters<typeof extractText>[0];
  const text = extractText(data);
  if (!text.trim()) throw new Error("EMPTY_OPENROUTER_VISION");
  return text.trim();
}
