import { NextResponse } from "next/server";
import { fetchCCPProducts, syncInventory, isCCPConfigured } from "@/lib/ccp-client";

export async function GET() {
  try {
    const [products, inventory] = await Promise.all([
      fetchCCPProducts(),
      syncInventory(),
    ]);

    return NextResponse.json({
      products,
      inventory: Object.fromEntries(inventory),
      configured: isCCPConfigured(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to sync with Cloud Commerce Pro" },
      { status: 500 }
    );
  }
}
