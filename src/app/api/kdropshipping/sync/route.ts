import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { fetchKDropProducts, isKDropConfigured } from "@/lib/kdropshipping/client";
import { mapKDropBatch } from "@/lib/kdropshipping/map-product";
import { applySyncedProducts, loadMergedCatalog } from "@/lib/catalog";

function authorize(req: Request) {
  const secret = process.env.K_DROPSHIPPING_SYNC_SECRET ?? process.env.K_DROPSHIPPING_WEBHOOK_SECRET;
  if (!secret) return true;
  const key = req.headers.get("x-sync-key") ?? req.headers.get("authorization");
  return key === secret || key === `Bearer ${secret}`;
}

/** Manual / cron sync — pulls products from K-Dropshipping API */
export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isKDropConfigured()) {
    return NextResponse.json(
      {
        error: "K_DROPSHIPPING_API_URL and K_DROPSHIPPING_API_KEY required",
        configured: false,
      },
      { status: 503 }
    );
  }

  const raw = await fetchKDropProducts();
  const mapped = mapKDropBatch(raw);
  await applySyncedProducts(mapped);
  const catalog = await loadMergedCatalog(true);

  return NextResponse.json({
    ok: true,
    pulled: raw.length,
    mapped: mapped.length,
    totalCatalog: catalog.length,
    updatedAt: new Date().toISOString(),
  });
}

export async function GET(req: Request) {
  return POST(req);
}
