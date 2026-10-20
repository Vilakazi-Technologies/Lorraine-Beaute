import { NextRequest, NextResponse } from "next/server";
import { loadMergedCatalog } from "@/lib/catalog";
import { runStoreChat } from "@/lib/vilatech-ai/commerce";

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const catalog = await loadMergedCatalog();
  const result = await runStoreChat(message, catalog, history ?? []);

  return NextResponse.json({
    reply: result.reply,
    productIds: result.productIds,
    poweredBy: result.poweredBy,
  });
}
