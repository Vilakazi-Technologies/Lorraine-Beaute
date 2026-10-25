"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCatalog } from "@/lib/catalog-context";
import { VILATECH } from "@/lib/brand";
import { formatPrice } from "@/lib/utils";

interface AssistPayload {
  coachMessage: string;
  upsellProductIds: string[];
  trustTips: string[];
  poweredBy: string;
}

export function CheckoutAiCoach({ subtotal }: { subtotal: number }) {
  const { items, addItem } = useCart();
  const { products: catalog } = useCatalog();
  const [assist, setAssist] = useState<AssistPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const cartKey = items.map((i) => `${i.product.id}:${i.quantity}`).join("|");

  useEffect(() => {
    if (items.length === 0) {
      setAssist(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void fetch("/api/checkout/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        subtotal,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAssist(data);
      })
      .catch(() => {
        if (!cancelled) setAssist(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cartKey, subtotal, items]);

  const upsells = (assist?.upsellProductIds ?? [])
    .map((id) => catalog.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="mb-8 bg-gradient-to-br from-accent/5 to-rose/20 border border-border rounded-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent" />
        <p className="text-xs tracking-[0.2em] uppercase font-medium text-accent">
          {VILATECH} Checkout Coach
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Personalising your checkout…</p>
      ) : assist ? (
        <>
          <p className="text-sm leading-relaxed mb-4">{assist.coachMessage}</p>
          <ul className="space-y-1.5 mb-4">
            {assist.trustTips.map((tip) => (
              <li key={tip} className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-sage shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
          {upsells.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Complete your routine
              </p>
              <div className="space-y-2">
                {upsells.map((p) => (
                  <div key={p!.id} className="flex items-center gap-3 bg-background/80 rounded-sm p-2">
                    <div className="relative w-11 h-14 rounded-sm overflow-hidden bg-muted shrink-0">
                      <Image src={p!.image} alt="" fill className="object-cover" sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${p!.slug}`}
                        className="text-xs font-medium line-clamp-2 hover:text-accent"
                      >
                        {p!.name}
                      </Link>
                      <p className="text-xs text-accent font-semibold">{formatPrice(p!.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addItem(p!)}
                      className="text-[9px] uppercase px-3 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition-colors shrink-0"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground mt-3">{assist.poweredBy}</p>
        </>
      ) : null}
    </div>
  );
}
