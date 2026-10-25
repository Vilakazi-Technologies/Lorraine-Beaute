import type { Product } from "@/lib/products";
import { resolveListingImage } from "./listing-image-resolver";
import type { KDropProductPayload } from "./types";
import { mapKDropBatch } from "./map-product";

export interface ListingCsvRow {
  name: string;
  sourceUrl: string;
  supplier: string;
  variantCount: number;
  sku: string;
  status: string;
  createdTime: string;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

export function parseListingsCsv(text: string): ListingCsvRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const rows: ListingCsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 6) continue;
    const skuRaw = cols[4]?.replace(/"/g, "").trim() ?? "";
    const firstSku = skuRaw.split(",")[0]?.trim() ?? skuRaw;
    rows.push({
      name: cols[0]?.trim() ?? "",
      sourceUrl: cols[1]?.trim() ?? "",
      supplier: cols[2]?.trim() ?? "K-Dropshipping",
      variantCount: parseInt(cols[3] ?? "1", 10) || 1,
      sku: firstSku,
      status: cols[5]?.trim() ?? "",
      createdTime: cols[6]?.trim() ?? "",
    });
  }
  return rows.filter((r) => r.name && r.sku);
}

function extractBrand(name: string): string {
  const cleaned = name.replace(/^\[[^\]]+\]\s*/, "");
  if (/^LANEIGE/i.test(cleaned)) return "LANEIGE";
  if (/Beauty of Joseon/i.test(cleaned)) return "Beauty of Joseon";
  if (/^COSRX/i.test(cleaned)) return "COSRX";
  if (/SKIN1004/i.test(cleaned)) return "SKIN1004";
  if (/^Anua/i.test(cleaned)) return "Anua";
  const parts = cleaned.split(" ");
  return parts[0] ?? "K-Beauty";
}

function inferCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("candle") || n.includes("fragrance")) return "fragrance";
  if (n.includes("spf") || n.includes("sun")) return "suncare";
  if (n.includes("cleanser") || n.includes("clean")) return "cleansers";
  if (n.includes("toner")) return "toners";
  if (n.includes("mask") || n.includes("patch")) return "masks";
  if (n.includes("moist") || n.includes("cream") || n.includes("bank")) return "moisturisers";
  if (n.includes("set") || n.includes("kit") || n.includes("duo") || n.includes("pack"))
    return "sets";
  if (n.includes("lip") || n.includes("cushion") || n.includes("plumper")) return "lips";
  if (n.includes("serum") || n.includes("essence") || n.includes("ampoule")) return "serums";
  return "serums";
}

function estimatePriceZAR(name: string, variants: number): number {
  const n = name.toLowerCase();
  if (n.includes("discovery kit") || n.includes("duo set")) return 699;
  if (n.includes("double pack") || n.includes("special set")) return 799;
  if (variants > 5) return 649;
  if (n.includes("cushion") || n.includes("plumper")) return 549;
  if (n.includes("serum") || n.includes("cream") || n.includes("toner")) return 449;
  if (n.includes("mask")) return 399;
  return 479;
}

export function listingRowToPayload(
  row: ListingCsvRow,
  imageOverride?: string
): KDropProductPayload {
  const brand = extractBrand(row.name);
  const category = inferCategory(row.name);
  const price = estimatePriceZAR(row.name, row.variantCount);
  const image = imageOverride ?? resolveListingImage(row.name, brand);

  return {
    sku: row.sku,
    id: row.sku,
    title: row.name,
    name: row.name,
    brand,
    vendor: brand,
    category,
    product_type: category,
    price,
    compare_at_price: Math.round(price * 1.18 / 10) * 10 - 1,
    currency: "ZAR",
    image,
    images: [image],
    description: `${row.name}. Authentic K-beauty sourced via K-Dropshipping. Ships from Korea with trusted fulfilment.`,
    in_stock: row.status.toUpperCase() !== "ARCHIVED",
    tags: ["k-dropshipping", brand.toLowerCase().replace(/\s+/g, "-")],
    rating: 4.8,
    review_count: 120 + (row.sku.length % 400),
    source_url: row.sourceUrl || undefined,
  };
}

export function listingsCsvToProducts(
  csv: string,
  imageBySku?: Record<string, string>
): Product[] {
  const rows = parseListingsCsv(csv);
  const payloads = rows.map((r) =>
    listingRowToPayload(r, imageBySku?.[r.sku])
  );
  return mapKDropBatch(payloads);
}
