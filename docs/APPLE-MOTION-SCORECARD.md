# Lorraine Beauté — Apple design principles scorecard

**Scope:** Homepage, `/shop`, product PDP, skin analysis (modal + page), checkout.  
**Date:** 2026-10-25 · **Production:** https://lorraine-beauty-store.vercel.app

| Principle | Score (1–5) | Notes |
|-----------|-------------|--------|
| **Purpose** | 4 | Clear hero (Shop + Skin Analysis). Skin analysis is the USP; nav no longer duplicates FAB. |
| **Simplicity** | 3 | Shop + filters + chat + skin FAB + cart — busy on mobile; primary paths still clear. |
| **Agency** | 4 | Skin flow: Back, Cancel, Upload photo, close modal. Chat overlay dismissible. |
| **Responsibility** | 3 → **4** | AI/camera copy strengthened; photo not stored; cosmetic-only disclaimer on scan. |
| **Familiarity** | 4 | Standard e-commerce + floating assistant patterns. |
| **Craft** | 4 | Cormorant / Great Vibes / cream–rose palette consistent. |
| **Delight** | 3 | Preloader + marquees — must respect reduced motion (implemented). |
| **Inclusion** | 3 → **4** | Skip link + reduced-motion tokens on critical animations. |

## Top 3 fixes (implemented)

1. **Responsibility (AI/camera)** — Skin analysis intro states cosmetic guidance only, secure processing, optional upload if camera fails.
2. **Motion / inclusion** — Shared `motion-tokens` + `usePrefersReducedMotion`; infinite spins and decorative loops disabled when `prefers-reduced-motion: reduce`.
3. **Purpose (motion on ads)** — Meta brief is **motion-only** 9:16 (no static poster frame); hook in 2s, end-card CTA.

## Follow-ups (not in this pass)

- PDP: single primary CTA above fold on mobile.
- Checkout: shorten checkout coach copy when cart is empty.
- Optional Remotion repo: `lorraine-remotion-ads` wired to catalog JSON for product names.
