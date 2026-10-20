import { NextRequest, NextResponse } from "next/server";
import { loadMergedCatalog } from "@/lib/catalog";
import { runCheckoutAssist } from "@/lib/vilatech-ai/commerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = Number(body.subtotal) || 0;
    const catalog = await loadMergedCatalog();
    const result = await runCheckoutAssist(catalog, items, subtotal);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        coachMessage: "Secure checkout — authentic K-beauty shipped with care.",
        upsellProductIds: [],
        trustTips: ["Secure checkout", "Authentic products"],
        poweredBy: "ViLATECH AI",
      },
      { status: 200 }
    );
  }
}
