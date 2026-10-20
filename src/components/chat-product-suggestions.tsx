"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function ChatProductSuggestions({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  if (products.length === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      {products.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-2 bg-background border border-border rounded-lg p-2"
        >
          <div className="relative w-10 h-12 rounded-sm overflow-hidden bg-muted shrink-0">
            <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/product/${p.slug}`} className="text-xs font-medium line-clamp-2 hover:text-accent">
              {p.name}
            </Link>
            <p className="text-[10px] text-accent font-semibold">{formatPrice(p.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => addItem(p)}
            className="text-[9px] uppercase tracking-wide px-2 py-1.5 border border-accent text-accent rounded-full shrink-0 hover:bg-accent hover:text-white transition-colors"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
