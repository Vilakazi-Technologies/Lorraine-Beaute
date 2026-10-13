import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { loadMergedCatalog, getProductBySlug } from "@/lib/catalog";
import { isKDropConfigured } from "@/lib/kdropshipping/client";
import { readFileSync, existsSync } from "fs";
import path from "path";

function fileUpdatedAt(): string | null {
  try {
    const f = path.join(process.cwd(), "src", "data", "synced-catalog.json");
    if (!existsSync(f)) return null;
    const parsed = JSON.parse(readFileSync(f, "utf-8")) as { updatedAt?: string };
    return parsed.updatedAt ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const products = await loadMergedCatalog();

  if (slug) {
    const product = getProductBySlug(slug, products);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  }

  return NextResponse.json({
    products,
    count: products.length,
    kDropConfigured: isKDropConfigured(),
    updatedAt: fileUpdatedAt() ?? new Date().toISOString(),
  });
}
