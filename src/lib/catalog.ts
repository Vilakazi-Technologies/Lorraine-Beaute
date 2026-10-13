import {
  products as seedProducts,
  collections,
  reviews,
  type Product,
  type Review,
  type Collection,
} from "@/lib/products";
import { mapKDropBatch } from "@/lib/kdropshipping/map-product";
import { fetchKDropProducts } from "@/lib/kdropshipping/client";
import {
  fetchRemoteSyncedCatalog,
  getSyncedProductsFromMemory,
  setSyncedProducts,
} from "@/lib/catalog-store";

export type { Product, Review, Collection };

export { collections, reviews, SKIN_HERO, FRAGRANCE_HERO, DEMO_CATALOG_SOURCE } from "@/lib/products";

export {
  getReviewsForProduct,
  getUpsellProducts,
  getBestsellers,
  getProductsForSkinConcerns,
  getSkincareProducts,
  getFragranceProducts,
  getUpsellOnlyProducts,
  recentPurchases,
} from "@/lib/products";

let mergedCache: Product[] | null = null;
let mergedCacheAt = 0;
const CACHE_MS = 60_000;

/** Store catalog = K-Drop synced listings only (no demo / legacy seed products). */
function activeCatalog(synced: Product[]): Product[] {
  return synced;
}

export async function loadMergedCatalog(force = false): Promise<Product[]> {
  const now = Date.now();
  if (!force && mergedCache && now - mergedCacheAt < CACHE_MS) {
    return mergedCache;
  }

  let synced = getSyncedProductsFromMemory();
  const remote = await fetchRemoteSyncedCatalog();
  if (remote.length > 0) synced = remote;

  if (process.env.K_DROPSHIPPING_API_URL && process.env.K_DROPSHIPPING_API_KEY) {
    const apiItems = await fetchKDropProducts();
    if (apiItems.length > 0) {
      synced = mapKDropBatch(apiItems);
      setSyncedProducts(synced);
    }
  }

  mergedCache = activeCatalog(synced);
  mergedCacheAt = now;
  return mergedCache;
}

export function getMergedCatalogSync(): Product[] {
  if (mergedCache) return mergedCache;
  return activeCatalog(getSyncedProductsFromMemory());
}

export async function applySyncedProducts(products: Product[]) {
  setSyncedProducts(products);
  mergedCache = activeCatalog(products);
  mergedCacheAt = Date.now();
}

export function getProductBySlug(slug: string, list?: Product[]) {
  const catalog = list ?? getMergedCatalogSync();
  return catalog.find((p) => p.slug === slug);
}

export function getProductById(id: string, list?: Product[]) {
  const catalog = list ?? getMergedCatalogSync();
  return catalog.find((p) => p.id === id);
}

export function getProductsByCategory(category: string, list?: Product[]) {
  const catalog = list ?? getMergedCatalogSync();
  return catalog.filter((p) => p.category === category);
}

export const products = seedProducts;
