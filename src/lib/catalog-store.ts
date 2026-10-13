import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import type { Product } from "@/lib/products";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CATALOG_FILE = path.join(DATA_DIR, "synced-catalog.json");

export interface SyncedCatalogFile {
  updatedAt: string | null;
  source: string;
  products: Product[];
}

let memoryCatalog: Product[] | null = null;

function readFileCatalog(): Product[] {
  try {
    if (!existsSync(CATALOG_FILE)) return [];
    const raw = readFileSync(CATALOG_FILE, "utf-8");
    const parsed = JSON.parse(raw) as SyncedCatalogFile;
    return parsed.products ?? [];
  } catch {
    return [];
  }
}

export function getSyncedProductsFromMemory(): Product[] {
  if (memoryCatalog) return memoryCatalog;
  memoryCatalog = readFileCatalog();
  return memoryCatalog;
}

export function setSyncedProducts(products: Product[]) {
  memoryCatalog = products;
  const payload: SyncedCatalogFile = {
    updatedAt: new Date().toISOString(),
    source: "k-dropshipping",
    products,
  };

  if (process.env.NODE_ENV === "development" || process.env.KD_CATALOG_PERSIST === "1") {
    try {
      if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
      writeFileSync(CATALOG_FILE, JSON.stringify(payload, null, 2), "utf-8");
    } catch {
      /* read-only fs */
    }
  }

  if (process.env.KD_CATALOG_WEBHOOK_URL) {
    void fetch(process.env.KD_CATALOG_WEBHOOK_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }
}

export async function fetchRemoteSyncedCatalog(): Promise<Product[]> {
  const url = process.env.KD_CATALOG_URL;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as SyncedCatalogFile;
    return data.products ?? [];
  } catch {
    return [];
  }
}
