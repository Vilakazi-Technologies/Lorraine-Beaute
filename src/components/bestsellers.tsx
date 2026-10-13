"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";
import { ProductCard } from "./product-card";

export function Bestsellers() {
  const { products } = useCatalog();
  const bestsellers = products
    .filter((p) => p.supplier === "k-beauty")
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              K-Beauty Bestsellers
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold">
              Most Loved Skincare
            </h2>
          </div>
          <Link
            href="/shop?category=skincare"
            className="hidden sm:inline-flex items-center gap-2 text-sm tracking-wide uppercase text-accent font-medium hover:text-accent-dark transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {bestsellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
