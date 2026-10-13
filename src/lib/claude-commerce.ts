/**
 * Claude Commerce — Anthropic-powered product intelligence
 * Handles skin analysis, personalised recommendations, and order insights.
 */

import type { Product } from "./products";

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

function buildCatalogSummary(catalog: Product[]) {
  return catalog
    .map(
      (p) =>
        `[${p.id}] ${p.name} (R${p.price}) — ${p.description}. Concerns: ${p.skinConcerns?.join(", ") || "general"}. Category: ${p.category}.`
    )
    .join("\n");
}

function pickProductsForConcerns(catalog: Product[], concerns: string[], limit = 4): string[] {
  if (catalog.length === 0) return [];
  const matched = catalog.filter((p) =>
    p.skinConcerns?.some((c) => concerns.includes(c))
  );
  const pool = matched.length > 0 ? matched : catalog;
  return pool
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map((p) => p.id);
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

export async function analyzeSkinWithClaude(
  imageBase64: string,
  catalog: Product[],
  mediaType: "image/jpeg" | "image/png" = "image/jpeg"
): Promise<SkinAnalysisResult> {
  const catalogSummary = buildCatalogSummary(catalog);

  const system = `You are a professional K-beauty skincare analyst for Lorraine Beauté, a Korean skincare store in South Africa.
Analyze the provided face photo and return ONLY valid JSON with this exact structure:
{
  "skinType": "oily|dry|combination|normal|sensitive",
  "concerns": ["array of detected concerns: dryness, dullness, dark-spots, uneven-tone, fine-lines, texture, large-pores, dehydration, sensitivity, dry-lips"],
  "summary": "2-3 sentence friendly assessment",
  "recommendations": ["3 specific skincare tips"],
  "recommendedProductIds": ["product ids from catalog, max 4"]
}

Product catalog:
${catalogSummary || "(empty — return generic tips and empty recommendedProductIds)"}

Be encouraging, professional, and accurate. Never make medical diagnoses. Only use product ids that appear in the catalog.`;

  if (!isConfigured() || catalog.length === 0) {
    return getDemoSkinAnalysis(catalog);
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
    if (!jsonMatch) return getDemoSkinAnalysis(catalog);

    const parsed = JSON.parse(jsonMatch[0]) as SkinAnalysisResult;
    const validIds = parsed.recommendedProductIds.filter((id) =>
      catalog.some((p) => p.id === id)
    );
    const recommendedProductIds =
      validIds.length > 0
        ? validIds.slice(0, 4)
        : pickProductsForConcerns(catalog, parsed.concerns ?? []);

    return { ...parsed, recommendedProductIds };
  } catch {
    return getDemoSkinAnalysis(catalog);
  }
}

export async function getClaudeProductRecommendation(
  query: string,
  catalog: Product[],
  history: { role: string; content: string }[] = []
): Promise<string> {
  const catalogSummary = buildCatalogSummary(catalog);

  const system = `You are the Lorraine Beauté shopping assistant powered by Claude.
Help customers find products. Prices are in South African Rand (ZAR).
Free shipping over R900. Code WELCOME15 for 15% off first order.

Catalog:
${catalogSummary}

Be warm, concise (under 120 words), and recommend specific products by name from the catalog only.`;

  if (!isConfigured() || catalog.length === 0) {
    return getFallbackReply(query, catalog);
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
    return getFallbackReply(query, catalog);
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
      upsellSuggestions: [],
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

function getDemoSkinAnalysis(catalog: Product[]): SkinAnalysisResult {
  const concerns = ["dullness", "uneven-tone", "dehydration"];
  const recommendedProductIds = pickProductsForConcerns(catalog, concerns, 4);

  return {
    skinType: "combination",
    concerns,
    summary:
      "Your skin shows a healthy base with some areas that could benefit from extra hydration and brightening. A consistent K-beauty routine — cleanse, treat, moisturise, and SPF — will help you build that clear, calm glow.",
    recommendations: [
      "Double cleanse in the evening to remove SPF and impurities",
      "Layer a hydrating toner or serum on slightly damp skin",
      "Always finish daytime care with broad-spectrum SPF",
    ],
    recommendedProductIds,
  };
}

function getFallbackReply(message: string, catalog: Product[]): string {
  const lower = message.toLowerCase();
  const byCategory = (cat: string) => catalog.find((p) => p.category === cat);
  const first = catalog[0];

  if (lower.includes("sun") || lower.includes("spf")) {
    const p = catalog.find((x) => x.category === "suncare") ?? first;
    return p
      ? `For daily protection, try ${p.name} (${formatZar(p.price)}). Korean SPF formulas are lightweight and perfect under makeup.`
      : "Browse our shop for SPF essentials — daily sun care is the best anti-ageing step.";
  }
  if (lower.includes("serum") || lower.includes("glow") || lower.includes("skin")) {
    const p = byCategory("serums") ?? byCategory("moisturisers") ?? first;
    return p
      ? `I'd suggest ${p.name} (${formatZar(p.price)}). Try our free AI Skin Analysis for picks matched to your face.`
      : "Try our AI Skin Analysis on the site for personalised product matches from our K-beauty catalog.";
  }
  if (lower.includes("ship") || lower.includes("delivery")) {
    return "Free shipping on orders over R900 across South Africa. Use WELCOME15 for 15% off your first order.";
  }
  if (first) {
    return `Welcome to Lorraine Beauté! Explore ${first.name} and ${catalog.length - 1} more K-beauty essentials in the shop, or run a free Skin Analysis for tailored recommendations.`;
  }
  return "Welcome to Lorraine Beauté! Visit the shop to browse our curated Korean skincare.";
}

function formatZar(n: number) {
  return `R${n.toLocaleString("en-ZA")}`;
}

export function isClaudeConfigured() {
  return isConfigured();
}

export function getRecommendedProducts(ids: string[], catalog: Product[]): Product[] {
  return ids.map((id) => catalog.find((p) => p.id === id)).filter(Boolean) as Product[];
}
