"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collections } from "@/lib/products";
import { useCatalog } from "@/lib/catalog-context";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

const shopCategories = [
  { slug: "all", name: "All" },
  { slug: "skincare", name: "Skincare" },
  ...collections.filter((c) => c.slug !== "fragrance"),
  { slug: "toners", name: "Toners" },
  { slug: "lips", name: "Makeup" },
];

const categoryDescriptions: Record<string, string> = {
  all: "Authentic K-beauty from your K-Dropshipping catalog",
  skincare: "LANEIGE, Beauty of Joseon & more — synced to your store",
};

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(categoryParam ?? "all");
  const [sortBy, setSortBy] = useState("popular");
  const { products, loading } = useCatalog();

  useEffect(() => {
    setActiveCategory(categoryParam ?? "all");
  }, [categoryParam]);

  const filtered = products
    .filter((p) => {
      if (activeCategory === "all") return true;
      if (activeCategory === "skincare") return p.supplier === "k-beauty";
      return p.category === activeCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

  const activeLabel =
    shopCategories.find((c) => c.slug === activeCategory)?.name ?? "Shop";

  const description =
    categoryDescriptions[activeCategory] ?? categoryDescriptions.all;

  return (
    <main className="py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4">
            {activeCategory === "all" ? "All Products" : activeLabel}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto px-2">
            {description}
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 mb-8 sm:mb-10">
          <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap pb-1 sm:pb-0">
              {shopCategories.map((col) => (
                <button
                  key={col.slug}
                  onClick={() => setActiveCategory(col.slug)}
                  className={cn(
                    "shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap",
                    activeCategory === col.slug
                      ? "bg-accent text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground sm:hidden">
              {loading ? "…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="ml-auto border border-border rounded-full px-4 py-2 text-xs sm:text-sm bg-background focus:outline-none focus:border-accent min-w-[9.5rem]"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-20">Loading catalog…</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
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
