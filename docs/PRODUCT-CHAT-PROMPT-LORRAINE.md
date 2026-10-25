# Lorraine Beauté — Apple design + motion (copy-paste prompt)

Source: `VILATECH WEBSITE/career/PRODUCT-CHAT-PROMPTS-APPLE-MOTION.md` (Lorraine block).

```
You are aligning Lorraine Beauté with VILATECH standards.

MANDATORY: Read and apply agent skills apple-design-principles, apple-design, motion-design, and remotion-video before changing UI.

Project: luxury K-beauty e-commerce — https://lorraine-beauty-store.vercel.app
Stack: Next.js, Tailwind, Framer Motion, AI skin analysis.

Goals:
1. Run an apple-design-principles scorecard on homepage, /shop, product PDP, skin analysis, and checkout. Fix top 3 issues (Purpose, Simplicity, Responsibility for AI/camera).
2. Motion: every animation must guide attention or state — use motion-tokens pattern (durations, ease, prefers-reduced-motion). No decorative loops on critical paths.
3. Meta ads: propose one 9:16 Remotion storyboard (6–12s) for Meta Reels — motion only, no static poster. Hook in 2s, CTA end card, safe captions zone.
4. Ship minimal diffs; match existing Cormorant / Great Vibes / cream palette.

Deliver: short audit summary + implemented fixes + Remotion brief if no video repo yet.
```

**Deliverables in this repo**

- Scorecard: [`APPLE-MOTION-SCORECARD.md`](./APPLE-MOTION-SCORECARD.md)
- Meta Reels (motion-only): [`META-REELS-REMOTION-BRIEF.md`](./META-REELS-REMOTION-BRIEF.md)
- Code: `src/lib/motion-tokens.ts`, `src/lib/hooks/use-prefers-reduced-motion.ts`
