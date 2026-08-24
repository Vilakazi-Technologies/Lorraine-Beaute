"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { products, collections } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(categoryParam ?? "all");
  const [sortBy, setSortBy] = useState("popular");

  const filtered = products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

  return (
    <main className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold mb-4">
            {activeCategory === "all"
              ? "All Products"
              : collections.find((c) => c.slug === activeCategory)?.name ?? "Shop"}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Discover our curated collection of luxury beauty essentials
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-5 py-2 rounded-full text-sm transition-colors",
                activeCategory === "all"
                  ? "bg-accent text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveCategory(col.slug)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm transition-colors",
                  activeCategory === col.slug
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {col.name}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-border rounded-full px-4 py-2 text-sm bg-background focus:outline-none focus:border-accent"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">
            No products found in this category.
          </p>
        )}
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
