/** Payload shapes from K-Dropshipping (webhook / REST — field names may vary) */
export interface KDropProductPayload {
  id?: string | number;
  external_id?: string;
  sku?: string;
  title?: string;
  name?: string;
  description?: string;
  body_html?: string;
  price?: number | string;
  compare_at_price?: number | string;
  retail_price?: number | string;
  currency?: string;
  images?: string[] | { src: string }[];
  image?: string;
  category?: string;
  product_type?: string;
  tags?: string[] | string;
  in_stock?: boolean;
  stock?: number;
  brand?: string;
  vendor?: string;
  rating?: number;
  review_count?: number;
}

export interface KDropWebhookBody {
  event?: "product.created" | "product.updated" | "product.deleted" | "catalog.sync";
  product?: KDropProductPayload;
  products?: KDropProductPayload[];
}

export interface KDropOrderPayload {
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: { sku: string; quantity: number; price: number; name?: string }[];
  total: number;
  currency?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}
