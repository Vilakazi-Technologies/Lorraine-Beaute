import { NextResponse } from "next/server";
import { mapKDropBatch, mapKDropToProduct } from "@/lib/kdropshipping/map-product";
import type { KDropWebhookBody } from "@/lib/kdropshipping/types";
import {
  applySyncedProducts,
  loadMergedCatalog,
} from "@/lib/catalog";
import { getSyncedProductsFromMemory } from "@/lib/catalog-store";
import type { Product } from "@/lib/products";

export const runtime = "nodejs";

function authorize(req: Request) {
  const secret = process.env.K_DROPSHIPPING_WEBHOOK_SECRET;
  if (!secret) return true;
  const header = req.headers.get("x-kdropshipping-secret") ?? req.headers.get("authorization");
  if (!header) return false;
  if (header === secret || header === `Bearer ${secret}`) return true;
  return false;
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: KDropWebhookBody;
  try {
    body = (await req.json()) as KDropWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = body.products
    ? mapKDropBatch(body.products)
    : body.product
      ? mapKDropToProduct(body.product)
        ? [mapKDropToProduct(body.product)!]
        : []
      : [];

  if (incoming.length === 0 && body.event !== "catalog.sync") {
    return NextResponse.json({ ok: true, message: "No products in payload" });
  }

  let next = [...getSyncedProductsFromMemory()];

  if (body.event === "catalog.sync" && body.products) {
    next = mapKDropBatch(body.products);
  } else if (body.event === "product.deleted" && body.product) {
    const sku = body.product.sku ?? String(body.product.id);
    next = next.filter((p) => p.sku !== sku && p.id !== `kd-${body.product?.id}`);
  } else {
    for (const p of incoming) {
      next = next.filter((x) => x.sku !== p.sku);
      next.push(p);
    }
  }

  await applySyncedProducts(next);
  const catalog = await loadMergedCatalog(true);

  return NextResponse.json({
    ok: true,
    synced: next.length,
    totalCatalog: catalog.length,
    updatedAt: new Date().toISOString(),
  });
}

export async function GET() {
  const catalog = await loadMergedCatalog();
  return NextResponse.json({
    ok: true,
    syncedCount: getSyncedProductsFromMemory().length,
    totalCount: catalog.length,
  });
}
