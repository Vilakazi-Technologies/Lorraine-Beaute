# Lorraine Beauty Store

Luxury e-commerce store built with Next.js, inspired by [As Ever](https://asever.com) and [Kylie Cosmetics](https://kyliecosmetics.com).

## Features

- **Modern storefront** — editorial hero, category collections, bestsellers, press reviews, Instagram gallery
- **Conversion optimization** — upsell suggestions, newsletter popup, recently-purchased social proof, cart drawer
- **ChatGPT assistant** — AI-powered shopping chatbot with product knowledge
- **Cloud Commerce Pro** — API integration for order sync and inventory management
- **Page transitions** — smooth Framer Motion animations throughout

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local`:

```
OPENAI_API_KEY=sk-...          # Powers the ChatGPT chatbot
CCP_API_URL=...                # Cloud Commerce Pro API
CCP_API_KEY=...
CCP_STORE_ID=...
```

The store works in demo mode without API keys — the chatbot uses smart fallbacks and orders are simulated.

## Design

Color palette blends As Ever's warm cream/berry tones with Kylie Cosmetics' modern rose/nude aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FAF7F2` | Warm ivory |
| Accent | `#8B3A4A` | Dusty rose |
| Accent Dark | `#4A1C2B` | Deep berry |
| Sage | `#9CAF88` | Natural green |
| Gold | `#B8956C` | Premium highlights |

## Cloud Commerce Pro

Orders submitted at checkout are routed to `/api/ccp/orders` which syncs with CCP when credentials are configured. Product inventory syncs via `/api/ccp/products`.

## Project Structure

```
src/
  app/           — Pages (home, shop, product, checkout) + API routes
  components/    — UI components (hero, cart, chatbot, popups)
  lib/           — Products, cart state, CCP client, utilities
```
