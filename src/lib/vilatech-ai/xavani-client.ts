type XavaniConfig = { baseUrl: string; apiKey: string; model: string };

function getConfig(): XavaniConfig {
  const apiKey = process.env.XAVANI_API_KEY?.trim();
  const rawUrl = process.env.XAVANI_BASE_URL?.trim();
  if (!apiKey || !rawUrl) throw new Error("XAVANI_UNAVAILABLE");
  const url = new URL(rawUrl);
  return {
    baseUrl: url.origin,
    apiKey,
    model: process.env.XAVANI_MODEL?.trim() || "omera",
  };
}

async function post(config: XavaniConfig, body: unknown): Promise<Response> {
  const res = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("XAVANI_UNAVAILABLE");
  return res;
}

export async function xavaniCompleteJson(system: string, userContent: string): Promise<string> {
  const config = getConfig();
  const res = await post(config, {
    model: config.model,
    stream: false,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userContent },
    ],
  });
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("INVALID_XAVANI_RESPONSE");
  }
  return content.trim();
}

export async function xavaniCompleteText(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const config = getConfig();
  const res = await post(config, {
    model: config.model,
    stream: false,
    messages: [{ role: "system", content: system }, ...messages],
  });
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("INVALID_XAVANI_RESPONSE");
  }
  return content.trim();
}
