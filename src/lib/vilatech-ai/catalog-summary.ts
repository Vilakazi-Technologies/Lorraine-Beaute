import type { Product } from "@/lib/products";

export function buildCatalogSummary(catalog: Product[]): string {
  return catalog
    .map(
      (p) =>
        `[${p.id}] ${p.name} (R${p.price}) — ${p.description}. Category: ${p.category}. Concerns: ${p.skinConcerns?.join(", ") || "general"}.`
    )
    .join("\n");
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
    .sort((a, b) => b.rating - a.rating)
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
