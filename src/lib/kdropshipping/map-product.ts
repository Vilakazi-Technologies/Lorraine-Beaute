import type { Product } from "@/lib/products";
import { slugify } from "@/lib/utils";
import type { KDropProductPayload } from "./types";

const ZAR_PER_USD = 18.5;

function parsePrice(value: number | string | undefined, currency?: string): number {
  if (value === undefined || value === "") return 0;
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return 0;
  if (currency?.toUpperCase() === "USD" || (n < 200 && currency !== "ZAR")) {
    return Math.round(n * ZAR_PER_USD / 10) * 10 - 1 || Math.round(n * ZAR_PER_USD);
  }
  return Math.round(n);
}

function normalizeImages(raw: KDropProductPayload): string[] {
  const list: string[] = [];
  if (raw.image) list.push(raw.image);
  if (Array.isArray(raw.images)) {
    for (const img of raw.images) {
      if (typeof img === "string") list.push(img);
      else if (img?.src) list.push(img.src);
    }
  }
  return [...new Set(list.filter(Boolean))];
}

/** Match catalog picks to real product roles (not generic dullness on every SKU). */
export function inferSkinConcerns(name: string, category: string): string[] {
  const n = name.toLowerCase();
  const concerns = new Set<string>();

  if (n.includes("lip") || n.includes("plumper")) concerns.add("dry-lips");
  if (n.includes("sun") || n.includes("spf") || n.includes("relief sun")) {
    concerns.add("uneven-tone");
    concerns.add("sensitivity");
    concerns.add("fine-lines");
  }
  if (n.includes("pore") || n.includes("red bean")) {
    concerns.add("large-pores");
    concerns.add("texture");
  }
  if (
    (n.includes("glow") && (n.includes("serum") || n.includes("niacinamide") || n.includes("propolis"))) ||
    n.includes("glow serum")
  ) {
    concerns.add("dullness");
    concerns.add("dark-spots");
    concerns.add("uneven-tone");
  }
  if (n.includes("retinal") || (n.includes("under eye") && n.includes("patch"))) {
    concerns.add("fine-lines");
    concerns.add("dark-spots");
    concerns.add("dehydration");
  }
  if (n.includes("green plum") && n.includes("toner")) {
    concerns.add("texture");
    concerns.add("dullness");
    concerns.add("large-pores");
  }
  if (n.includes("rice") && n.includes("honey")) {
    concerns.add("dullness");
    concerns.add("texture");
    concerns.add("uneven-tone");
  }
  if (n.includes("water bank") || n.includes("hyaluronic") || n.includes("cream skin")) {
    concerns.add("dehydration");
    concerns.add("dryness");
  }
  if (n.includes("intensive cream")) concerns.add("fine-lines");
  if (n.includes("cushion")) {
    concerns.add("uneven-tone");
    concerns.add("dullness");
  }
  if (n.includes("homme")) {
    concerns.add("dehydration");
    concerns.add("texture");
  }
  if (n.includes("discovery kit") || n.includes("hanbang")) {
    concerns.add("dullness");
    concerns.add("uneven-tone");
    concerns.add("texture");
  }
  if (n.includes("blueha") || (n.includes("serum") && n.includes("laneige"))) {
    concerns.add("dehydration");
    concerns.add("dullness");
  }
  if (n.includes("ginseng") && n.includes("sun")) {
    concerns.add("fine-lines");
    concerns.add("dehydration");
    concerns.add("uneven-tone");
  }

  if (concerns.size > 0) return [...concerns];

  switch (category) {
    case "suncare":
      return ["uneven-tone", "sensitivity", "fine-lines"];
    case "masks":
      return ["dullness", "texture", "dehydration"];
    case "moisturisers":
      return ["dehydration", "dryness", "fine-lines"];
    case "serums":
      return ["dullness", "uneven-tone", "texture"];
    case "toners":
      return ["texture", "large-pores", "dullness"];
    case "lips":
      return ["dry-lips", "dehydration"];
    case "cleansers":
      return ["sensitivity", "texture", "large-pores"];
    default:
      return ["dullness", "dehydration"];
  }
}

function inferCategory(raw: KDropProductPayload): string {
  const hay = `${raw.category ?? ""} ${raw.product_type ?? ""} ${raw.tags ?? ""}`.toLowerCase();
  if (hay.includes("fragrance") || hay.includes("candle")) return "fragrance";
  if (hay.includes("sun") || hay.includes("spf")) return "suncare";
  if (hay.includes("cleanser") || hay.includes("clean")) return "cleansers";
  if (hay.includes("toner")) return "toners";
  if (hay.includes("mask")) return "masks";
  if (hay.includes("moist") || hay.includes("cream")) return "moisturisers";
  if (hay.includes("set") || hay.includes("kit")) return "sets";
  if (hay.includes("lip") || hay.includes("makeup")) return "lips";
  return "serums";
}

function parseTags(raw: KDropProductPayload): string[] {
  if (Array.isArray(raw.tags)) return raw.tags.map(String);
  if (typeof raw.tags === "string") return raw.tags.split(",").map((t) => t.trim());
  return ["k-dropshipping"];
}

export function mapKDropToProduct(raw: KDropProductPayload, index = 0): Product | null {
  const name = (raw.title ?? raw.name)?.trim();
  if (!name) return null;

  const images = normalizeImages(raw);
  if (images.length === 0) return null;

  const externalId = String(raw.id ?? raw.external_id ?? raw.sku ?? index);
  const slugBase = slugify(name);
  const sku = raw.sku?.trim() || `KD-${externalId}`;
  const price = parsePrice(raw.price ?? raw.retail_price, raw.currency);
  const compareAt = raw.compare_at_price
    ? parsePrice(raw.compare_at_price, raw.currency)
    : undefined;

  const descriptionPlain = (raw.description ?? raw.body_html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const shortDesc =
    descriptionPlain.slice(0, 120) + (descriptionPlain.length > 120 ? "…" : "") ||
    name;

  return {
    id: `kd-${externalId}`,
    slug: `kd-${slugBase}-${externalId}`.slice(0, 80),
    name,
    brand: raw.brand ?? raw.vendor ?? "K-Beauty",
    description: shortDesc,
    longDescription: descriptionPlain || shortDesc,
    price: price || 299,
    compareAtPrice: compareAt && compareAt > (price || 0) ? compareAt : undefined,
    category: inferCategory(raw),
    tags: [...parseTags(raw), "synced"],
    image: images[0],
    images,
    rating: raw.rating ?? 4.8,
    reviewCount: raw.review_count ?? 0,
    badge: raw.in_stock === false ? undefined : "New",
    inStock: raw.in_stock !== false && (raw.stock ?? 1) > 0,
    sku,
    supplier: "k-beauty",
    skinConcerns: inferSkinConcerns(name, inferCategory(raw)),
    sourceUrl: raw.source_url ?? raw.sourceUrl,
  };
}

export function mapKDropBatch(items: KDropProductPayload[]): Product[] {
  return items
    .map((item, i) => mapKDropToProduct(item, i))
    .filter((p): p is Product => p !== null);
}
