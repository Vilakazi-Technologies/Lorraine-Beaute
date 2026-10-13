import type { KDropOrderPayload, KDropProductPayload } from "./types";

const API_URL = process.env.K_DROPSHIPPING_API_URL ?? "";
const API_KEY = process.env.K_DROPSHIPPING_API_KEY ?? "";
const STORE_ID = process.env.K_DROPSHIPPING_STORE_ID ?? "";

export function isKDropConfigured() {
  return Boolean(API_URL && API_KEY);
}

async function kdropFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "X-Store-Id": STORE_ID,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`K-Dropshipping API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

/** Pull full catalog from K-Dropshipping (endpoint path configurable via env) */
export async function fetchKDropProducts(): Promise<KDropProductPayload[]> {
  if (!isKDropConfigured()) return [];

  const listPath = process.env.K_DROPSHIPPING_PRODUCTS_PATH ?? "/products";

  try {
    const data = await kdropFetch<{ products?: KDropProductPayload[]; data?: KDropProductPayload[] }>(
      listPath
    );
    return data.products ?? data.data ?? [];
  } catch {
    return [];
  }
}

export async function submitOrderToKDrop(order: KDropOrderPayload): Promise<{ success: boolean; id: string }> {
  if (!isKDropConfigured()) {
    return { success: true, id: `KD-DEMO-${Date.now()}` };
  }

  const orderPath = process.env.K_DROPSHIPPING_ORDERS_PATH ?? "/orders";
  const data = await kdropFetch<{ id?: string; orderId?: string }>(orderPath, {
    method: "POST",
    body: JSON.stringify(order),
  });

  return { success: true, id: data.orderId ?? data.id ?? `KD-${Date.now()}` };
}
