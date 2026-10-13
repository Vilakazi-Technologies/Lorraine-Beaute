import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { listingsCsvToProducts } from "@/lib/kdropshipping/parse-listings-csv";
import { applySyncedProducts } from "@/lib/catalog";
import { setSyncedProducts } from "@/lib/catalog-store";

export const runtime = "nodejs";

function authorize(req: Request) {
  const secret = process.env.K_DROPSHIPPING_SYNC_SECRET ?? process.env.K_DROPSHIPPING_WEBHOOK_SECRET;
  if (!secret) return true;
  const key = req.headers.get("x-sync-key") ?? req.headers.get("authorization");
  return key === secret || key === `Bearer ${secret}`;
}

/** Import K-Dropshipping listings CSV (export from dashboard) */
export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let csv = "";
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (file instanceof File) {
      csv = await file.text();
    }
  } else if (contentType.includes("text/csv")) {
    csv = await req.text();
  } else {
    try {
      const body = (await req.json()) as { csv?: string; path?: string };
      if (body.csv) csv = body.csv;
      else if (body.path) {
        const resolved = path.isAbsolute(body.path)
          ? body.path
          : path.join(process.cwd(), body.path);
        csv = readFileSync(resolved, "utf-8");
      }
    } catch {
      return NextResponse.json({ error: "Expected CSV file or JSON { csv }" }, { status: 400 });
    }
  }

  if (!csv.trim()) {
    return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
  }

  process.env.KD_CATALOG_PERSIST = "1";
  const products = listingsCsvToProducts(csv);
  setSyncedProducts(products);
  await applySyncedProducts(products);

  return NextResponse.json({
    ok: true,
    imported: products.length,
    updatedAt: new Date().toISOString(),
    slugs: products.slice(0, 5).map((p) => p.slug),
  });
}
