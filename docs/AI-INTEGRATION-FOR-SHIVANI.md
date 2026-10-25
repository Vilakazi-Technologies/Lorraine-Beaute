# AI integration guide — Lorraine Beauté (for Shivani)

This store already has the **chatbot** and **AI skin analysis** built in the Next.js app. Your job is to connect them to a live AI provider (we use **Anthropic Claude** as the primary system) by adding secrets in **Vercel** (or your host) and confirming they work in production.

**Live store:** https://lorraine-beauty-store.vercel.app  
**Repo:** https://github.com/Vilakazi-Technologies/Lorraine-Beaute  

---

## What needs to work

| Feature | Where in the app | Backend route | Primary AI |
|--------|------------------|---------------|------------|
| **Shopping chatbot** | Floating chat widget on every page | `POST /api/chat` | Claude (Anthropic), optional OpenAI fallback |
| **Skin analysis** | `/skin-analysis` + mobile FAB | `POST /api/skin-analysis` | Claude with **vision** (face photo) |

Both features read the **live product catalog** from `/api/catalog` (K-Dropshipping CSV sync in `src/data/synced-catalog.json`). Recommendations must only reference those products — no separate product list to maintain for AI.

---

## Step 1 — ViLATECH AI gateway (same OpenRouter / Gemini as **vilatech-ai** chat)

The store uses **`src/lib/vilatech-ai/commerce.ts`**. By default it does **not** use the old Xavani/Omera mirror. It calls **ViLATECH AI** (`https://vilatech-ai.vercel.app`) which already has **`OPENROUTER_API_KEY`** and **`google/gemini-2.5-flash-lite`** — the same stack as the **AI Form Submission Tool / ViLATECH AI** app.

Provider priority on Lorraine:

1. **Gateway** — if `VILATECH_STORE_SECRET` is set (and no local `OPENROUTER_API_KEY`)
2. **OpenRouter** — if you paste `OPENROUTER_API_KEY` on lorraine-beauty-store directly
3. **Anthropic** — optional vision fallback only

### One-time: shared store secret (both Vercel projects)

Generate a long random string (e.g. 32+ hex chars). Add **the same value** to **Production** on:

| Project | Variable |
|---------|----------|
| **vilatech-ai** | `VILATECH_STORE_SECRET` |
| **lorraine-beauty-store** | `VILATECH_STORE_SECRET` |

Optional on lorraine only:

| Variable | Purpose |
|----------|---------|
| `VILATECH_AI_GATEWAY_URL` | Default `https://vilatech-ai.vercel.app` |
| `OPENROUTER_MODEL` / `OPENROUTER_VISION_MODEL` | Already set to `google/gemini-2.5-flash-lite` |

**Redeploy lorraine-beauty-store** (and vilatech-ai if you just added the secret there) after saving env vars.

Check: https://lorraine-beauty-store.vercel.app/api/ai/status — expect `"chatProvider": "gateway"`, `"ready": true`, and `"gateway": "https://vilatech-ai.vercel.app"`.

**Features wired:**

- **Chatbot** → `/api/chat` → product cards from `productIds`
- **Skin analysis** → questionnaire → camera → `/api/skin-analysis`
- **Checkout coach** → `/api/checkout/assist` → upsells + trust copy

---

## Step 2 — OpenAI (optional chatbot fallback only)

The chat route tries **Anthropic first**. If `ANTHROPIC_API_KEY` is missing, it can use OpenAI when `OPENAI_API_KEY` is set (`gpt-4o-mini` in `src/app/api/chat/route.ts`).

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Optional second provider for `/api/chat` only |

Skin analysis **does not** use OpenAI today — use Anthropic for skin scan.

---

## Step 3 — Verify in production

### Chatbot

1. Open the store → click the chat icon.
2. Ask: *“What SPF do you recommend?”* or *“Something for dry skin under R500?”*
3. Expect a short reply that names **real products** from the catalog (LANEIGE / Beauty of Joseon, etc.).
4. If you see generic “demo” wording and no specific catalog names, check Vercel logs for `/api/chat` and confirm `ANTHROPIC_API_KEY` is set on **Production**.

### Skin analysis

1. Go to **Skin Analysis** (nav or `/skin-analysis`).
2. Allow **camera** permission (HTTPS required — works on Vercel).
3. **Capture & Analyse** → wait for results → **Recommended For You** should show up to **4 product cards** from the live catalog.
4. Without `ANTHROPIC_API_KEY`, the app still returns a **rule-based demo result** (skin type + tips + catalog picks) so the flow is testable; with the key, Claude analyses the photo.

**Camera tips for Shivani / QA:** use Chrome or Safari on mobile or desktop; if permission is blocked, reset site permissions for `lorraine-beauty-store.vercel.app`.

---

## Step 4 — Local development (optional)

```bash
cd lorraine-beauty-store
cp .env.example .env.local
# Add ANTHROPIC_API_KEY=... to .env.local (never commit this file)
npm install
npm run dev
```

- Chat: http://localhost:3000 (open chatbot)  
- Skin: http://localhost:3000/skin-analysis  

---

## Architecture (short)

```text
Browser (chatbot)     → POST /api/chat           → claude-commerce → Anthropic API
Browser (skin scan)   → POST /api/skin-analysis  → loadMergedCatalog() + analyzeSkinWithClaude()
Catalog (all features)→ GET  /api/catalog        → synced-catalog.json (+ future K-Drop API)
```

**Do not** expose `ANTHROPIC_API_KEY` in the browser. Keys stay server-side only in API routes.

---

## K-Dropshipping / products (context for AI)

- Products on the site come from **`src/data/synced-catalog.json`** (imported from K-Drop listings CSV).
- Re-import when the client adds products: `npx tsx scripts/import-listings.ts path/to/export.csv`
- Commit the updated JSON and redeploy, **or** configure automatic sync later via `K_DROPSHIPPING_*` env vars (see `.env.example`).

AI recommendations automatically follow whatever is in that catalog — no extra wiring per product.

---

## Checklist for Shivani

- [ ] `ANTHROPIC_API_KEY` set in Vercel **Production** (and Preview if you test PRs)
- [ ] Production redeploy completed after adding secrets
- [ ] Chatbot returns catalog-specific product names
- [ ] Skin analysis: camera → capture → results → product cards link to real PDPs
- [ ] Confirm no API keys in GitHub (only `.env.example` with empty placeholders)

---

## Support contacts

- **Store / Vercel / repo access:** Vilakazi Technologies  
- **Anthropic billing & model access:** org admin for the Anthropic account  
- **Product catalog updates:** K-Dropshipping CSV export → import script (above)

If anything fails, check **Vercel → Deployments → Functions** logs for `/api/chat` and `/api/skin-analysis` — errors usually show missing key, model not enabled, or invalid API response.
