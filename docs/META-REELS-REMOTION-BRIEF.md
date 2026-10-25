# Meta Reels — 9:16 motion-only ad (Remotion)

**Format:** 1080×1920 · **Duration:** 10s · **FPS:** 30 · **No static poster** — first frame is already in motion (soft parallax on cream gradient).

**Skills:** `remotion-video`, `motion-design`, brand tokens from Lorraine (`--accent`, `--cream`, Cormorant + DM Sans).

## Storyboard (motion only)

| Time | Frames @30fps | Visual | Motion |
|------|---------------|--------|--------|
| 0.0–2.0s | 0–60 | Hook: face-scan UI wireframe + live product tiles | Questionnaire step dots advance; headline slides up (`spring`, damping 200) |
| 2.0–5.0s | 60–150 | “Consultation” phase text cycles once (hydration → pores → match) | Crossfade text; subtle scale on product thumb |
| 5.0–8.0s | 150–240 | Results card: skin type + 2 catalog products (from props) | Stagger reveal; no loop — hold for read |
| 8.0–10.0s | 240–300 | End card: **Lorraine Beauté** + **Free skin analysis** + **lorraine-beauty-store.vercel.app** | Logo settle; CTA pill pulses once (disabled if `prefersReducedMotion` prop) |

**Safe zones:** Keep captions and CTA in center 80% width; bottom 220px clear for Reels UI.

## Remotion composition sketch

```tsx
// Composition: LorraineReelsAd — props: productNames: string[], hookLine: string
// Root: <Composition id="LorraineReels9x16" width={1080} height={1920} fps={30} durationInFrames={300} />
// Use Sequence for Hook / Analysis / Results / EndCard — no `<Img>` poster export.
```

## Copy (default props)

- **Hook (0–2s):** “Your K-beauty routine, personalised in 60 seconds.”
- **End card:** “Free AI skin analysis · Authentic LANEIGE & Beauty of Joseon · Shop in ZAR”

## Render

```bash
npx remotion render LorraineReels9x16 out/lorraine-meta-reels.mp4
```

Scaffold repo in a follow-up chat: `lorraine-beauty-store/remotion/` or sibling `lorraine-remotion-ads`.
