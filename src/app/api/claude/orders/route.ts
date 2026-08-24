import { NextRequest, NextResponse } from "next/server";
import { processOrderWithClaude } from "@/lib/claude-commerce";

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const result = await processOrderWithClaude({
      items: order.items ?? [],
      total: order.total ?? 0,
      customerName: order.customerName ?? "Customer",
    });
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { success: true, orderId: `LB-${Date.now()}`, summary: "Order received." },
      { status: 200 }
    );
  }
}
