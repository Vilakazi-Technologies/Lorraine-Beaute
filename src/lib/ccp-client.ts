/**
 * Cloud Commerce Pro API client
 * Docs: https://cloudcommercepro.com/connect/
 *
 * Syncs products, inventory, and orders with CCP backend.
 * Falls back to local catalog when credentials aren't configured.
 */

import { products, type Product } from "./products";

const CCP_API_URL = process.env.CCP_API_URL ?? "";
const CCP_API_KEY = process.env.CCP_API_KEY ?? "";
const CCP_STORE_ID = process.env.CCP_STORE_ID ?? "";

export interface CCPOrder {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: { sku: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface CCPProduct {
  sku: string;
  name: string;
  price: number;
  stockLevel: number;
  description: string;
}

function isConfigured() {
  return Boolean(CCP_API_URL && CCP_API_KEY && CCP_STORE_ID);
}

async function ccpFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CCP_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CCP_API_KEY}`,
      "X-Store-Id": CCP_STORE_ID,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`CCP API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchCCPProducts(): Promise<CCPProduct[]> {
  if (!isConfigured()) {
    return products.map((p) => ({
      sku: p.sku,
      name: p.name,
      price: p.price,
      stockLevel: p.inStock ? 100 : 0,
      description: p.description,
    }));
  }

  try {
    const data = await ccpFetch<{ products: CCPProduct[] }>("/products");
    return data.products;
  } catch {
    return products.map((p) => ({
      sku: p.sku,
      name: p.name,
      price: p.price,
      stockLevel: p.inStock ? 100 : 0,
      description: p.description,
    }));
  }
}

export async function syncInventory(): Promise<Map<string, number>> {
  const ccpProducts = await fetchCCPProducts();
  const stockMap = new Map<string, number>();
  for (const p of ccpProducts) {
    stockMap.set(p.sku, p.stockLevel);
  }
  return stockMap;
}

export async function submitOrderToCCP(order: CCPOrder): Promise<{ success: boolean; orderId: string }> {
  if (!isConfigured()) {
    return { success: true, orderId: `DEMO-${Date.now()}` };
  }

  try {
    const data = await ccpFetch<{ orderId: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });
    return { success: true, orderId: data.orderId };
  } catch (error) {
    console.error("CCP order submission failed:", error);
    throw error;
  }
}

export function mergeCCPStock(product: Product, stockMap: Map<string, number>): Product {
  const stock = stockMap.get(product.sku);
  if (stock === undefined) return product;
  return { ...product, inStock: stock > 0 };
}

export function isCCPConfigured() {
  return isConfigured();
}
