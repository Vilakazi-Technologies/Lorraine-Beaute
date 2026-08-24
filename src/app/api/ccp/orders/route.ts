import { NextRequest, NextResponse } from "next/server";
import { submitOrderToCCP, fetchCCPProducts, isCCPConfigured } from "@/lib/ccp-client";

export async function GET() {
  try {
    const products = await fetchCCPProducts();
    return NextResponse.json({
      products,
      source: isCCPConfigured() ? "cloud-commerce-pro" : "local-catalog",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const result = await submitOrderToCCP({
      orderId: "",
      ...order,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit order" },
      { status: 500 }
    );
  }
}
