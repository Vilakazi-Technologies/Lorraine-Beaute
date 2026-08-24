import { NextRequest, NextResponse } from "next/server";
import { getClaudeProductRecommendation } from "@/lib/claude-commerce";

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (anthropicKey) {
    const reply = await getClaudeProductRecommendation(message, history ?? []);
    return NextResponse.json({ reply, poweredBy: "claude" });
  }

  if (openaiKey) {
    try {
      const { products } = await import("@/lib/products");
      const system = `You are the Lorraine Beauté shopping assistant. Prices in ZAR (South African Rand). Free shipping over R900. Code WELCOME15 for 15% off.\n\nCatalog:\n${products.map((p) => `- ${p.name} (R${p.price}): ${p.description}`).join("\n")}`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            ...(history ?? []).slice(-6),
            { role: "user", content: message },
          ],
          max_tokens: 300,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          reply: data.choices?.[0]?.message?.content ?? "How can I help you today?",
          poweredBy: "openai",
        });
      }
    } catch {
      /* fall through */
    }
  }

  const { getClaudeProductRecommendation: fallback } = await import("@/lib/claude-commerce");
  const reply = await fallback(message, history ?? []);
  return NextResponse.json({ reply, poweredBy: "demo" });
}
