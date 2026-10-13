"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-accent text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-medium">
              {product.badge}
            </span>
          )}
          {product.compareAtPrice && (
            <span className="absolute top-3 right-3 bg-gold text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-medium">
              Sale
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-full bg-foreground text-background py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-accent transition-colors"
            >
              Quick Add
            </button>
          </div>
        </div>
      </Link>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < Math.floor(product.rating)
                  ? "fill-gold text-gold"
                  : "fill-border text-border"
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>
        {product.brand && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            {product.brand}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
