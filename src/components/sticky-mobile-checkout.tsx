"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

interface StickyMobileCheckoutProps {
  product: Product;
  quantity: number;
}

export function StickyMobileCheckout({ product, quantity }: StickyMobileCheckoutProps) {
  const { addItem, openCart } = useCart();
  const router = useRouter();

  const lineTotal = product.price * quantity;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] lg:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-14 rounded-sm overflow-hidden bg-muted shrink-0">
          <Image src={product.image} alt="" fill className="object-cover" sizes="48px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <p className="text-accent font-semibold">{formatPrice(lineTotal)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(product, quantity);
            openCart();
          }}
          className="shrink-0 px-4 py-3 bg-muted text-foreground text-[10px] tracking-[0.12em] uppercase font-medium rounded-full"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(product, quantity);
            router.push("/checkout");
          }}
          className="shrink-0 px-5 py-3 bg-accent text-white text-[10px] tracking-[0.12em] uppercase font-medium rounded-full"
        >
          Buy Now
        </button>
      </div>
      <Link
        href="/checkout"
        className="sr-only"
      >
        Checkout
      </Link>
    </div>
  );
}
