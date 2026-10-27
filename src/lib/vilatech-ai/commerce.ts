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
  rankProductsForAnalysis,
  resolveLooseProductIds,
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
import {
  gatewayCompleteJson,
  gatewayCompleteVisionJson,
} from "@/lib/vilatech-ai/gateway-client";

export interface SkinAnalysisResult {
  skinType: string;
  concerns: string[];
  summary: string;
  recommendations: string[];
  recommendedProductIds: string[];
  productReasons?: Record<string, string>;
  poweredBy?: string;
  analysisSource?: "ai" | "fallback";
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
  "summary": "6-10 sentences in second person: what you SEE on the photo (forehead, cheeks, nose, chin — pores, oil, hydration, tone, texture). Cross-check questionnaire. Name 2-4 exact products FROM THE CATALOG by full product name and explain why each fits THIS face. No generic skincare lecture.",
  "recommendations": ["5-6 AM/PM steps; at least 3 steps must name a specific catalog product in plain language"],
  "recommendedProductIds": ["exact [id] values from catalog, max 4, prefer highest ★ when multiple fit"],
  "productReasons": { "productId": "one sentence tying this product to what you see on their skin" }
}`;

const SKIN_ANALYST_SYSTEM = `You are ViLATECH AI — a senior aesthetic skin consultant for Lorraine Beauté (K-beauty, South Africa).
Your tone is calm, personal, and advisory — like a GP or dermatologist explaining findings after looking at the patient's face, not like a generic website.
Assess barrier health, hydration, oil balance, pigmentation, pore appearance, texture, and sensitivity from the FACE PHOTO.
Cross-check every finding with the QUESTIONNAIRE; if photo and answers differ, explain both clearly and what you recommend they focus on.
Educate and recommend cosmetics only — do NOT diagnose disease, prescribe medication, or replace an in-person dermatologist.
If something needs medical attention (severe inflammation, possible infection, widespread rash), say so gently and suggest professional care.
You MUST use only product ids that appear in brackets in the catalog list. Do not invent products.
When choosing between suitable products, prefer higher star ratings and review counts shown in the catalog.
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

async function completeJson(
  system: string,
  userContent: string
): Promise<{ raw: string; poweredBy?: string }> {
  const provider = resolveVilatechProvider();
  if (provider === "gateway") return gatewayCompleteJson(system, userContent);
  if (provider === "openrouter") {
    return {
      raw: await openRouterCompleteJson(system, userContent),
      poweredBy: providerLabel("openrouter"),
    };
  }
  throw new Error("NO_JSON_PROVIDER");
}

async function completeChatText(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const provider = resolveVilatechProvider();
  if (provider === "gateway") {
    const payload = JSON.stringify({ messages: messages.slice(-6) });
    const { raw } = await gatewayCompleteJson(
      `${system}\nReply in plain text only (no JSON).`,
      payload
    );
    return raw;
  }
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

function ensureProductReasons(
  ids: string[],
  catalog: Product[],
  concernIds: string[],
  existing?: Record<string, string>
): Record<string, string> {
  const out = { ...(existing ?? {}) };
  for (const id of ids) {
    if (out[id]?.trim()) continue;
    const p = catalog.find((x) => x.id === id);
    if (!p) continue;
    const overlap = p.skinConcerns?.filter((c) => concernIds.includes(c)) ?? [];
    const focus = (overlap[0] ?? concernIds[0] ?? "your goals").replace(/-/g, " ");
    out[id] =
      `${p.name} is chosen for ${focus} — ★${p.rating.toFixed(1)} with ${p.reviewCount.toLocaleString()} reviews in our catalog.`;
  }
  return out;
}

function demoSkinAnalysis(
  catalog: Product[],
  questionnaire?: SkinQuestionnaireAnswers
): SkinAnalysisResult {
  const concerns = questionnaire?.concerns.length
    ? mapConcernLabelsToIds(questionnaire.concerns)
    : ["dullness", "dehydration", "uneven-tone"];
  const skinTypeRaw =
    questionnaire?.selfReportedSkinType?.toLowerCase().replace(/\s+/g, "") || "combination";
  const skinType = skinTypeRaw.includes("not") ? "combination" : skinTypeRaw;
  const productIds = rankProductsForAnalysis(catalog, concerns, []);
  const picks = productIds
    .map((id) => catalog.find((p) => p.id === id)?.name)
    .filter(Boolean) as string[];
  const concernText = questionnaire?.concerns.join(", ") || "hydration and radiance";
  const productReasons = ensureProductReasons(productIds, catalog, concerns);
  return {
    skinType,
    concerns,
    summary: `From your questionnaire and face scan, your ${skinType} skin profile suggests focusing on ${concernText.toLowerCase()}. I would prioritise barrier-friendly hydration, gentle actives, and daily sun protection — the same approach a skin clinician would start with before building a full routine. From our current catalog, I would begin with ${picks.slice(0, 2).join(" and ") || "serum and SPF layers"} and adjust as your skin responds over 4–6 weeks.`,
    recommendations: [
      "AM: gentle cleanse → hydrating toner or essence on damp skin → moisturiser → broad-spectrum SPF.",
      questionnaire?.usesSpfDaily
        ? "Keep SPF as your non-negotiable; reapply if you are outdoors midday."
        : "Add a lightweight Korean SPF every morning — this is the single biggest upgrade for tone and ageing.",
      "PM: double cleanse if you wore SPF/makeup → treatment serum for your main concern → moisturiser to seal.",
      skinType.includes("oily")
        ? "Use gel or water-cream textures; avoid heavy balms on congested areas."
        : "If skin feels tight after washing, choose cream or milk textures and reduce foaming cleansers.",
      picks[0]
        ? `Consider ${picks[0]} as your anchor product from our shop.`
        : "Browse serums and SPF in the shop matched to your goals.",
    ],
    recommendedProductIds: productIds,
    productReasons,
  };
}

function normalizeSkinResult(
  parsed: Partial<SkinAnalysisResult> & {
    productReasons?: Record<string, string> | Array<{ productId?: string; reason?: string }>;
  },
  catalog: Product[],
  questionnaire: SkinQuestionnaireAnswers,
  poweredBy?: string
): SkinAnalysisResult {
  const concernIds =
    parsed.concerns?.length
      ? parsed.concerns
      : mapConcernLabelsToIds(questionnaire.concerns).length
        ? mapConcernLabelsToIds(questionnaire.concerns)
        : ["dullness", "dehydration"];

  const looseIds = [
    ...(parsed.recommendedProductIds ?? []),
    ...Object.keys(
      parsed.productReasons && !Array.isArray(parsed.productReasons)
        ? parsed.productReasons
        : {}
    ),
  ];
  const resolvedLoose = resolveLooseProductIds(looseIds.map(String), catalog);
  const recommendedProductIds = rankProductsForAnalysis(
    catalog,
    concernIds,
    resolvedLoose
  );

  let productReasons: Record<string, string> | undefined;
  if (parsed.productReasons && !Array.isArray(parsed.productReasons)) {
    productReasons = {};
    for (const [id, reason] of Object.entries(parsed.productReasons)) {
      const resolved = resolveLooseProductIds([id], catalog)[0] ?? id;
      if (filterValidProductIds([resolved], catalog).length && reason?.trim()) {
        productReasons[resolved] = reason.trim();
      }
    }
  } else if (Array.isArray(parsed.productReasons)) {
    productReasons = {};
    for (const row of parsed.productReasons) {
      if (!row?.productId || !row.reason) continue;
      const resolved = resolveLooseProductIds([row.productId], catalog)[0];
      if (resolved) productReasons[resolved] = row.reason.trim();
    }
  }

  const summary = parsed.summary?.trim() ?? "";
  const recommendations = parsed.recommendations?.filter(Boolean) ?? [];

  const skinTypeRaw =
    parsed.skinType?.trim() ||
    questionnaire.selfReportedSkinType?.toLowerCase() ||
    "combination";

  const filledReasons = ensureProductReasons(
    recommendedProductIds,
    catalog,
    concernIds,
    productReasons
  );

  return {
    skinType: skinTypeRaw,
    concerns: concernIds,
    summary:
      summary.length >= 80
        ? summary
        : `${summary} ${buildProductAnchoredSummary(recommendedProductIds, catalog, questionnaire)}`.trim(),
    recommendations:
      recommendations.length >= 3
        ? recommendations
        : buildProductAnchoredSteps(recommendedProductIds, catalog, recommendations),
    recommendedProductIds,
    productReasons: filledReasons,
    poweredBy,
    analysisSource: "ai",
  };
}

function buildProductAnchoredSummary(
  ids: string[],
  catalog: Product[],
  questionnaire: SkinQuestionnaireAnswers
): string {
  const names = ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  if (names.length === 0) return "";
  const top = names[0];
  const second = names[1];
  const concerns = questionnaire.concerns.join(", ") || "your goals";
  return `Based on your scan and ${concerns.toLowerCase()}, I would start with ${top.name} (★${top.rating.toFixed(1)}, our top-rated match in catalog)${second ? `, then add ${second.name} for routine support` : ""}. These are in stock on Lorraine Beauté now.`;
}

function buildProductAnchoredSteps(
  ids: string[],
  catalog: Product[],
  existing: string[]
): string[] {
  const products = ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  const extra = products.slice(0, 3).map((p, i) => {
    const step =
      p.category === "suncare"
        ? "AM"
        : p.category === "masks"
          ? "PM treatment"
          : i === 0
            ? "After cleanse"
            : "Moisturise";
    return `${step}: use ${p.name} — ★${p.rating.toFixed(1)} (${p.reviewCount} reviews).`;
  });
  return [...existing, ...extra].slice(0, 6);
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
    const { raw, poweredBy } = await completeJson(system, userPayload);
    const parsed = parseJson<{ reply?: string; productIds?: string[] }>(raw);
    const productIds = filterValidProductIds(parsed.productIds ?? [], catalog).slice(0, 4);
    let reply = parsed.reply?.trim() ?? "";
    if (!reply || reply.startsWith("[") || reply.startsWith("{")) {
      const names = productIds
        .map((id) => catalog.find((p) => p.id === id)?.name)
        .filter(Boolean);
      reply =
        names.length > 0
          ? `For what you described, I would look at ${names.join(" and ")} from our live catalog — both fit common ${message.toLowerCase().includes("spf") || message.toLowerCase().includes("sun") ? "sun protection" : "K-beauty"} goals. Tell me your skin type or budget if you want me to narrow further.`
          : "How can I help you find the right K-beauty product from our catalog?";
    }
    return {
      reply,
      productIds,
      poweredBy: poweredBy ?? providerLabel(resolveVilatechProvider()),
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
  if (visionProvider === "none") {
    throw new Error("NO_VISION_PROVIDER");
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let raw: string;
      let poweredBy: string | undefined;
      if (visionProvider === "gateway") {
        const res = await gatewayCompleteVisionJson(system, userPrompt, imageDataUrl);
        raw = res.raw;
        poweredBy = res.poweredBy;
      } else if (visionProvider === "openrouter") {
        raw = await openRouterVisionJson(system, userPrompt, imageDataUrl);
        poweredBy = providerLabel("openrouter");
      } else {
        raw = await anthropicVisionJson(system, userPrompt, imageDataUrl);
        poweredBy = providerLabel("anthropic");
      }
      const parsed = parseJson<
        Partial<SkinAnalysisResult> & {
          productReasons?: Record<string, string>;
        }
      >(raw);
      return normalizeSkinResult(parsed, catalog, questionnaire, poweredBy);
    } catch (err) {
      lastError = err;
    }
  }

  console.error("Skin vision failed after retry:", lastError);
  const fallback = demoSkinAnalysis(catalog, questionnaire);
  return {
    ...fallback,
    analysisSource: "fallback",
    poweredBy: providerLabel(resolveVisionProvider()),
  };
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
    const { raw, poweredBy } = await completeJson(system, userPayload);
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
      poweredBy: poweredBy ?? providerLabel(resolveVilatechProvider()),
    };
  } catch {
    return {
      coachMessage:
        subtotal >= 900
          ? "Great news — you qualify for free shipping. Complete checkout to lock in your routine."
          : "Add one more favourite to reach R900 for free shipping, or checkout now — we'll pack with care.",
      upsellProductIds: pickCheckoutUpsells(catalog, cartIds, 2),
      trustTips: ["Authentic products via K-Dropshipping", "Encrypted checkout", "30-day returns"],
      poweredBy: "ViLATECH AI - Gemini 2.5 Flash",
    };
  }
}
