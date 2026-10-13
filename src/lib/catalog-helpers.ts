import type { Product } from "@/lib/products";
import {
  getReviewsForProduct,
  getUpsellProducts as getUpsellFromSeed,
} from "@/lib/products";

export function getUpsellProducts(product: Product, catalog: Product[]) {
  if (!product.upsellIds?.length) {
    return catalog
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 3);
  }
  return getUpsellFromSeed(product).filter(Boolean);
}

export { getReviewsForProduct };

export function resolveProductBySlug(slug: string, catalog: Product[]) {
  return catalog.find((p) => p.slug === slug);
}

export function resolveProductById(id: string, catalog: Product[]) {
  return catalog.find((p) => p.id === id);
}
