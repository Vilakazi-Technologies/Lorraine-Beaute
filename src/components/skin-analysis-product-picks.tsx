"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function SkinAnalysisProductPicks({
  products,
  reasons,
}: {
  products: Product[];
  reasons?: Record<string, string>;
}) {
  const { addItem } = useCart();
  if (products.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <p className="text-xs tracking-[0.2em] uppercase text-accent font-medium">
        Your personalised picks
      </p>
      <div className="flex flex-col gap-4">
        {products.map((p, index) => (
          <article
            key={p.id}
            className={`flex bg-card border border-border rounded-sm overflow-hidden shadow-sm hover:border-accent/40 transition-colors ${
              index === 0
                ? "flex-col sm:flex-row gap-0 sm:gap-5 ring-1 ring-accent/20"
                : "gap-4 sm:gap-5"
            }`}
          >
            <Link
              href={`/product/${p.slug}`}
              className={`relative shrink-0 bg-muted ${
                index === 0
                  ? "w-full sm:w-44 aspect-[4/3] sm:aspect-[3/4]"
                  : "w-28 sm:w-36 aspect-[3/4]"
              }`}
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, 144px"
                priority={index === 0}
              />
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-accent text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Top match
                </span>
              )}
            </Link>
            <div className="flex flex-col justify-center py-4 pr-4 min-w-0 flex-1">
              <div className="flex items-center gap-1 text-gold mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-medium">{p.rating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">
                  ({p.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              <Link
                href={`/product/${p.slug}`}
                className="font-medium text-sm sm:text-base leading-snug hover:text-accent line-clamp-2 mb-1"
              >
                {p.name}
              </Link>
              <p className="text-accent font-semibold text-sm mb-2">{formatPrice(p.price)}</p>
              {reasons?.[p.id] && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                  {reasons[p.id]}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-auto">
                <Link
                  href={`/product/${p.slug}`}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-accent font-medium hover:underline"
                >
                  View product
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => addItem(p)}
                  className="text-xs uppercase tracking-wide px-3 py-1.5 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition-colors"
                >
                  Add to bag
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
