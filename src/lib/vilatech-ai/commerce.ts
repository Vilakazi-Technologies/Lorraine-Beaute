import type { Product } from "@/lib/products";
import type { SkinQuestionnaireAnswers } from "@/lib/skin-questionnaire";
import {
  mapConcernLabelsToIds,
  questionnaireToPromptContext,
} from "@/lib/skin-questionnaire";
import {
  buildCatalogSummary,
  filterValidProductIds,
  pickCheckoutUpsells,
  pickProductsForConcerns,
} from "@/lib/vilatech-ai/catalog-summary";
import {
  openRouterCompleteJson,
  openRouterCompleteText,
  openRouterVisionJson,
} from "@/lib/vilatech-ai/openrouter-client";
import {
  providerLabel,
  resolveVilatechProvider,
  resolveVisionProvider,
} from "@/lib/vilatech-ai/provider";
import { xavaniCompleteJson, xavaniCompleteText } from "@/lib/vilatech-ai/xavani-client";

export interface SkinAnalysisResult {
  skinType: string;
  concerns: string[];
  summary: string;
  recommendations: string[];
  recommendedProductIds: string[];
}

export interface StoreChatResult {
  reply: string;
  productIds: string[];
  poweredBy: string;
}

export interface CheckoutAssistResult {
  coachMessage: string;
  upsellProductIds: string[];
  trustTips: string[];
  poweredBy: string;
}

const SKIN_JSON_SHAPE = `{
  "skinType": "oily|dry|combination|normal|sensitive",
  "concerns": ["dryness","dullness","dark-spots","uneven-tone","fine-lines","texture","large-pores","dehydration","sensitivity","dry-lips"],
  "summary": "4-5 sentences: what you observe on the photo, how it aligns with the questionnaire, and a clear care focus (not a medical diagnosis)",
  "recommendations": ["5 specific actionable skincare steps in order AM/PM"],
  "recommendedProductIds": ["ids from catalog, max 4"]
}`;

const SKIN_ANALYST_SYSTEM = `You are ViLATECH AI — a senior aesthetic skin analyst for Lorraine Beauté (K-beauty, South Africa).
Think like an experienced dermatology-informed consultant: assess barrier health, hydration, oil balance, pigmentation, texture, and sensitivity from the FACE PHOTO.
Cross-check every finding with the client's QUESTIONNAIRE answers; if they conflict, explain what you see vs what they reported.
You educate and recommend cosmetics — you do NOT diagnose disease, prescribe medication, or replace a dermatologist visit.
If you see signs that need in-person care (severe inflammation, possible infection, widespread rash), say so gently and suggest seeing a dermatologist.
Return ONLY valid JSON.`;

const CHAT_JSON_SHAPE = `{
  "reply": "warm helpful message under 120 words",
  "productIds": ["0-4 product ids from catalog when recommending products"]
}`;

const CHECKOUT_JSON_SHAPE = `{
  "coachMessage": "1-2 sentences reassuring the customer and nudging completion",
  "upsellProductIds": ["1-3 product ids not already in cart"],
  "trustTips": ["2 short trust bullets e.g. authentic K-beauty, secure checkout"]
}`;

function parseJson<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("INVALID_JSON");
    return JSON.parse(match[0]) as T;
  }
}

async function completeJson(system: string, userContent: string): Promise<string> {
  const provider = resolveVilatechProvider();
  if (provider === "xavani") return xavaniCompleteJson(system, userContent);
  if (provider === "openrouter") return openRouterCompleteJson(system, userContent);
  throw new Error("NO_JSON_PROVIDER");
}

async function completeChatText(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const provider = resolveVilatechProvider();
  if (provider === "xavani") return xavaniCompleteText(system, messages);
  if (provider === "openrouter") return openRouterCompleteText(system, messages);
  throw new Error("NO_CHAT_PROVIDER");
}

async function anthropicVisionJson(
  system: string,
  textPrompt: string,
  imageDataUrl: string
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) throw new Error("ANTHROPIC_UNAVAILABLE");
  const model = process.env.CLAUDE_MODEL?.trim() || "claude-sonnet-4-20250514";
  const mediaType = imageDataUrl.includes("image/png") ? "image/png" : "image/jpeg";
  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      system,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            { type: "text", text: textPrompt },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error("ANTHROPIC_VISION_FAILED");
  const data = await res.json();
  const block = data.content?.find((b: { type: string }) => b.type === "text");
  const text = block?.text ?? "";
  if (!text.trim()) throw new Error("EMPTY_ANTHROPIC");
  return text.trim();
}

function demoSkinAnalysis(
  catalog: Product[],
  questionnaire?: SkinQuestionnaireAnswers
): SkinAnalysisResult {
  const concerns = questionnaire?.concerns.length
    ? mapConcernLabelsToIds(questionnaire.concerns)
    : ["dullness", "dehydration", "uneven-tone"];
  const skinType =
    questionnaire?.selfReportedSkinType?.toLowerCase().replace(" ", "") || "combination";
  return {
    skinType: skinType.includes("not") ? "combination" : skinType,
    concerns,
    summary:
      "Based on your answers and scan, your skin would benefit from consistent hydration, gentle treatment, and daily SPF — a classic K-beauty path to clearer, calmer skin.",
    recommendations: [
      "Cleanse gently — avoid stripping foams if skin feels tight",
      questionnaire?.usesSpfDaily
        ? "Keep up your SPF; reapply if you're outdoors"
        : "Add a lightweight Korean SPF every morning",
      "Layer hydration: toner or serum on damp skin, then moisturise",
    ],
    recommendedProductIds: pickProductsForConcerns(catalog, concerns, 4),
  };
}

export async function runStoreChat(
  message: string,
  catalog: Product[],
  history: { role: string; content: string }[] = []
): Promise<StoreChatResult> {
  const catalogSummary = buildCatalogSummary(catalog);
  const system = `You are the Lorraine Beauté shopping assistant (ViLATECH AI Commerce).
Prices in South African Rand (ZAR). Free shipping over R900. Code WELCOME15 for 15% off first order.
Only recommend products from the catalog using their exact ids in productIds.
Return ONLY valid JSON: ${CHAT_JSON_SHAPE}

Catalog:
${catalogSummary}`;

  try {
    const userPayload = JSON.stringify({
      message,
      history: history.slice(-6),
    });
    const raw = await completeJson(system, userPayload);
    const parsed = parseJson<{ reply?: string; productIds?: string[] }>(raw);
    const productIds = filterValidProductIds(parsed.productIds ?? [], catalog).slice(0, 4);
    return {
      reply: parsed.reply?.trim() || "How can I help you find the right K-beauty product?",
      productIds,
      poweredBy: providerLabel(resolveVilatechProvider()),
    };
  } catch {
    /* text fallback */
  }

  try {
    const textSystem = `You are Lorraine Beauté's ViLATECH AI assistant. ZAR prices. Free shipping over R900. WELCOME15 for 15% off.
Catalog:\n${catalogSummary}\nBe warm and under 120 words. Name specific products when helpful.`;
    const reply = await completeChatText(
      textSystem,
      [
        ...history.slice(-4).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: message },
      ]
    );
    return {
      reply,
      productIds: pickProductsForConcerns(catalog, ["dullness", "dehydration"], 2),
      poweredBy: providerLabel(resolveVilatechProvider()),
    };
  } catch {
    return {
      reply:
        catalog[0]?.name
          ? `Browse ${catalog[0].name} and our full K-beauty catalog in the shop, or try Skin Analysis for personalised picks.`
          : "Welcome to Lorraine Beauté — visit the shop to explore Korean skincare.",
      productIds: catalog.slice(0, 2).map((p) => p.id),
      poweredBy: "ViLATECH AI",
    };
  }
}

export async function runSkinAnalysis(
  imageDataUrl: string,
  catalog: Product[],
  questionnaire: SkinQuestionnaireAnswers
): Promise<SkinAnalysisResult> {
  const catalogSummary = buildCatalogSummary(catalog);
  const context = questionnaireToPromptContext(questionnaire);
  const system = `${SKIN_ANALYST_SYSTEM}
Return shape: ${SKIN_JSON_SHAPE}
Only recommend product ids from this catalog:
${catalogSummary}`;

  const userPrompt = `QUESTIONNAIRE:\n${context}\n\nTASK: Perform a thorough visual skin assessment from the attached face photo. Match K-beauty products from the catalog to this person's needs.`;

  const visionProvider = resolveVisionProvider();
  try {
    let raw: string;
    if (visionProvider === "openrouter") {
      raw = await openRouterVisionJson(system, userPrompt, imageDataUrl);
    } else if (visionProvider === "anthropic") {
      raw = await anthropicVisionJson(system, userPrompt, imageDataUrl);
    } else {
      throw new Error("NO_VISION");
    }
    const parsed = parseJson<SkinAnalysisResult>(raw);
    const recommendedProductIds = filterValidProductIds(
      parsed.recommendedProductIds ?? [],
      catalog
    );
    return {
      ...parsed,
      recommendedProductIds:
        recommendedProductIds.length > 0
          ? recommendedProductIds.slice(0, 4)
          : pickProductsForConcerns(
              catalog,
              parsed.concerns?.length ? parsed.concerns : mapConcernLabelsToIds(questionnaire.concerns),
              4
            ),
    };
  } catch {
    return demoSkinAnalysis(catalog, questionnaire);
  }
}

export function getRecommendedProducts(ids: string[], catalog: Product[]): Product[] {
  return ids.map((id) => catalog.find((p) => p.id === id)).filter(Boolean) as Product[];
}

export async function runCheckoutAssist(
  catalog: Product[],
  cartItems: { productId: string; name: string; quantity: number; price: number }[],
  subtotal: number
): Promise<CheckoutAssistResult> {
  const cartIds = cartItems.map((i) => i.productId);
  const catalogSummary = buildCatalogSummary(catalog);
  const system = `You are ViLATECH AI checkout coach for Lorraine Beauté.
Help customers complete purchase with confidence and suggest 1-3 complementary upsells NOT already in cart.
Return ONLY valid JSON: ${CHECKOUT_JSON_SHAPE}
Catalog:\n${catalogSummary}`;

  const userPayload = JSON.stringify({ cartItems, subtotal, currency: "ZAR" });

  try {
    const raw = await completeJson(system, userPayload);
    const parsed = parseJson<{
      coachMessage?: string;
      upsellProductIds?: string[];
      trustTips?: string[];
    }>(raw);
    const upsellProductIds = filterValidProductIds(
      parsed.upsellProductIds ?? [],
      catalog
    )
      .filter((id) => !cartIds.includes(id))
      .slice(0, 3);

    return {
      coachMessage:
        parsed.coachMessage?.trim() ||
        "You're one step away from glass skin — your order is secure and we only ship authentic K-beauty.",
      upsellProductIds:
        upsellProductIds.length > 0
          ? upsellProductIds
          : pickCheckoutUpsells(catalog, cartIds, 3),
      trustTips: parsed.trustTips?.length
        ? parsed.trustTips.slice(0, 3)
        : ["100% authentic K-beauty", "Secure checkout", "Free shipping over R900"],
      poweredBy: providerLabel(resolveVilatechProvider()),
    };
  } catch {
    return {
      coachMessage:
        subtotal >= 900
          ? "Great news — you qualify for free shipping. Complete checkout to lock in your routine."
          : "Add one more favourite to reach R900 for free shipping, or checkout now — we'll pack with care.",
      upsellProductIds: pickCheckoutUpsells(catalog, cartIds, 2),
      trustTips: ["Authentic products via K-Dropshipping", "Encrypted checkout", "30-day returns"],
      poweredBy: "ViLATECH AI",
    };
  }
}
