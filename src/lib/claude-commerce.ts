/**
 * Claude Commerce — Anthropic-powered product intelligence
 * Handles skin analysis, personalised recommendations, and order insights.
 * Docs: https://docs.anthropic.com
 */

import { products, type Product } from "./products";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514";

export interface SkinAnalysisResult {
  skinType: string;
  concerns: string[];
  summary: string;
  recommendations: string[];
  recommendedProductIds: string[];
}

export interface ClaudeOrderInsight {
  orderId: string;
  summary: string;
  upsellSuggestions: string[];
}

function isConfigured() {
  return Boolean(ANTHROPIC_API_KEY);
}

async function claudeMessages(
  messages: { role: "user" | "assistant"; content: unknown }[],
  system: string,
  maxTokens = 1024
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const block = data.content?.find((b: { type: string }) => b.type === "text");
  return block?.text ?? "";
}

const CATALOG_SUMMARY = products
  .map(
    (p) =>
      `[${p.id}] ${p.name} (R${p.price}) — ${p.description}. Concerns: ${p.skinConcerns?.join(", ") || "general"}. Category: ${p.category}.`
  )
  .join("\n");

export async function analyzeSkinWithClaude(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" = "image/jpeg"
): Promise<SkinAnalysisResult> {
  const system = `You are a professional skincare analyst for Lorraine Beauté, a luxury beauty brand in South Africa.
Analyze the provided face photo and return ONLY valid JSON with this exact structure:
{
  "skinType": "oily|dry|combination|normal|sensitive",
  "concerns": ["array of detected concerns: dryness, dullness, dark-spots, uneven-tone, fine-lines, texture, large-pores, dehydration, sensitivity, dry-lips"],
  "summary": "2-3 sentence friendly assessment",
  "recommendations": ["3 specific skincare tips"],
  "recommendedProductIds": ["product ids from catalog, max 4"]
}

Product catalog:
${CATALOG_SUMMARY}

Be encouraging, professional, and accurate. Never make medical diagnoses.`;

  if (!isConfigured()) {
    return getDemoSkinAnalysis();
  }

  try {
    const text = await claudeMessages(
      [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
            {
              type: "text",
              text: "Analyze my skin and recommend products from the Lorraine Beauté catalog.",
            },
          ],
        },
      ],
      system
    );

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return getDemoSkinAnalysis();

    const parsed = JSON.parse(jsonMatch[0]) as SkinAnalysisResult;
    return {
      ...parsed,
      recommendedProductIds: parsed.recommendedProductIds.filter((id) =>
        products.some((p) => p.id === id)
      ),
    };
  } catch {
    return getDemoSkinAnalysis();
  }
}

export async function getClaudeProductRecommendation(
  query: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const system = `You are the Lorraine Beauté shopping assistant powered by Claude.
Help customers find products. Prices are in South African Rand (ZAR).
Free shipping over R900. Code WELCOME15 for 15% off first order.

Catalog:
${CATALOG_SUMMARY}

Be warm, concise (under 120 words), and recommend specific products by name.`;

  if (!isConfigured()) {
    return getFallbackReply(query);
  }

  try {
    const messages = [
      ...history.slice(-4).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: query },
    ];
    return await claudeMessages(messages, system, 400);
  } catch {
    return getFallbackReply(query);
  }
}

export async function processOrderWithClaude(order: {
  items: { name: string; price: number; quantity: number }[];
  total: number;
  customerName: string;
}): Promise<ClaudeOrderInsight> {
  if (!isConfigured()) {
    return {
      orderId: `LB-${Date.now()}`,
      summary: "Order received. Thank you for shopping Lorraine Beauté!",
      upsellSuggestions: ["Hydrating Lip Balm", "Glow Vitamin C Serum"],
    };
  }

  try {
    const text = await claudeMessages(
      [
        {
          role: "user",
          content: `Process this order and suggest 2 upsells as JSON: {"orderId":"LB-xxx","summary":"...","upsellSuggestions":["...","..."]}\n\n${JSON.stringify(order)}`,
        },
      ],
      "You are Claude Commerce for Lorraine Beauté. Return only JSON.",
      300
    );
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {
    /* fall through */
  }

  return {
    orderId: `LB-${Date.now()}`,
    summary: "Order received successfully.",
    upsellSuggestions: [],
  };
}

function getDemoSkinAnalysis(): SkinAnalysisResult {
  return {
    skinType: "combination",
    concerns: ["dullness", "uneven-tone", "dehydration"],
    summary:
      "Your skin shows a healthy base with some areas that could benefit from extra hydration and brightening. A vitamin C serum paired with a rich moisturiser would work beautifully for your skin profile.",
    recommendations: [
      "Use a vitamin C serum in the morning for brightness",
      "Apply hyaluronic moisturiser to lock in hydration",
      "Always finish with SPF 30+ during the day",
    ],
    recommendedProductIds: ["4", "10", "12"],
  };
}

function getFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("lip") || lower.includes("matte"))
    return "Our Plumping Matte Lip Kit (R449) is a bestseller — full coverage with a lightweight matte finish. The Candy K Matte Lip Kit (R399) is also iconic!";
  if (lower.includes("skin") || lower.includes("serum") || lower.includes("glow"))
    return "I'd recommend our Glow Vitamin C Serum (R649) for brightness, or the Hyaluronic Moisture Cream (R599) for deep hydration. Try our free AI Skin Analysis for personalised picks!";
  if (lower.includes("gift") || lower.includes("set"))
    return "The When the Day Slows Set (R1,499) is perfect for gifting — candle, serum, and lip balm beautifully packaged.";
  if (lower.includes("ship") || lower.includes("delivery"))
    return "Free shipping on orders over R900! We deliver across South Africa in 2–4 business days. Use WELCOME15 for 15% off your first order.";
  return "Welcome to Lorraine Beauté! Browse our Lips, Skincare, Fragrance, and Gift Sets — or try our AI Skin Analysis for personalised recommendations.";
}

export function isClaudeConfigured() {
  return isConfigured();
}

export function getRecommendedProducts(ids: string[]): Product[] {
  return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
}
