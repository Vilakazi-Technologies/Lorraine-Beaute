import type { Product } from "@/lib/products";

export function buildCatalogSummary(catalog: Product[]): string {
  return catalog
    .map(
      (p) =>
        `[${p.id}] ${p.name} — R${p.price} — ★${p.rating.toFixed(1)} (${p.reviewCount} reviews) — ${p.category} — concerns: ${p.skinConcerns?.join(", ") || "general"} — ${p.description.slice(0, 100)}`
    )
    .join("\n");
}

/** Prefer AI ids, then top-rated catalog matches for concerns. */
export function rankProductsForAnalysis(
  catalog: Product[],
  concernIds: string[],
  preferredIds: string[]
): string[] {
  const validPreferred = filterValidProductIds(preferredIds, catalog);
  const used = new Set<string>();
  const ordered: string[] = [];

  for (const id of validPreferred) {
    if (!used.has(id)) {
      ordered.push(id);
      used.add(id);
    }
  }

  const pool = catalog
    .filter((p) => !used.has(p.id))
    .filter((p) =>
      concernIds.length === 0
        ? true
        : p.skinConcerns?.some((c) => concernIds.includes(c))
    );

  const byScore = (a: Product, b: Product) => {
    const score = (p: Product) => p.rating * Math.log10(p.reviewCount + 10);
    return score(b) - score(a);
  };

  const ranked = (pool.length > 0 ? pool : catalog.filter((p) => !used.has(p.id)))
    .sort(byScore);

  for (const p of ranked) {
    if (ordered.length >= 4) break;
    if (!used.has(p.id)) {
      ordered.push(p.id);
      used.add(p.id);
    }
  }

  return ordered.slice(0, 4);
}

/** Map loose AI output (names, skus) to catalog ids. */
export function resolveLooseProductIds(raw: string[], catalog: Product[]): string[] {
  const byId = new Set(catalog.map((p) => p.id));
  const out: string[] = [];

  for (const token of raw) {
    const t = token.trim();
    if (!t) continue;
    if (byId.has(t)) {
      out.push(t);
      continue;
    }
    const lower = t.toLowerCase();
    const match = catalog.find(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        lower.includes(p.name.toLowerCase().slice(0, 20)) ||
        p.sku.toLowerCase() === lower ||
        p.id.toLowerCase() === lower
    );
    if (match) out.push(match.id);
  }

  return [...new Set(out)];
}

export function filterValidProductIds(ids: string[], catalog: Product[]): string[] {
  const set = new Set(catalog.map((p) => p.id));
  return ids.filter((id) => set.has(id));
}

export function pickProductsForConcerns(
  catalog: Product[],
  concerns: string[],
  limit = 4
): string[] {
  if (catalog.length === 0) return [];
  const matched = catalog.filter((p) =>
    p.skinConcerns?.some((c) => concerns.includes(c))
  );
  const pool = matched.length > 0 ? matched : catalog;
  return pool
    .sort(
      (a, b) =>
        b.rating * Math.log10(b.reviewCount + 10) -
        a.rating * Math.log10(a.reviewCount + 10)
    )
    .slice(0, limit)
    .map((p) => p.id);
}

export function pickCheckoutUpsells(
  catalog: Product[],
  cartProductIds: string[],
  limit = 3
): string[] {
  const inCart = new Set(cartProductIds);
  const cartCategories = new Set(
    catalog.filter((p) => inCart.has(p.id)).map((p) => p.category)
  );
  const candidates = catalog.filter((p) => !inCart.has(p.id));
  const complementary = candidates.filter(
    (p) => !cartCategories.has(p.category) || p.category === "suncare" || p.category === "masks"
  );
  const pool = complementary.length > 0 ? complementary : candidates;
  return pool
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map((p) => p.id);
}
