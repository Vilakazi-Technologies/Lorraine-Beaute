"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { collections } from "@/lib/products";
import { useCatalog } from "@/lib/catalog-context";

export function Collections() {
  const { products } = useCatalog();
  const activeSlugs = new Set(products.map((p) => p.category));
  const visible = collections.filter(
    (c) => c.slug !== "fragrance" && activeSlugs.has(c.slug)
  );

  if (visible.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Collections
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visible.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/shop?category=${col.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden rounded-sm"
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1">
                    {col.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/80 line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
