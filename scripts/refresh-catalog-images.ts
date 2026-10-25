/**
 * Re-apply per-product images to synced-catalog.json (no CSV required).
 * Usage: npx tsx scripts/refresh-catalog-images.ts
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { resolveListingImage } from "../src/lib/kdropshipping/listing-image-resolver";

const catalogPath = path.join(process.cwd(), "src", "data", "synced-catalog.json");
const raw = JSON.parse(readFileSync(catalogPath, "utf-8")) as {
  updatedAt: string;
  source: string;
  products: { name: string; brand?: string; image: string; images: string[] }[];
};

let changed = 0;
for (const p of raw.products) {
  const brand = p.brand ?? "K-Beauty";
  const image = resolveListingImage(p.name, brand);
  if (p.image !== image) {
    p.image = image;
    p.images = [image];
    changed++;
  }
}

raw.updatedAt = new Date().toISOString();
writeFileSync(catalogPath, JSON.stringify(raw, null, 2), "utf-8");
console.log(`Updated ${changed} product images in synced-catalog.json`);
