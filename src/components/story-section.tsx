"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SKIN_HERO } from "@/lib/products";

export function StorySection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] overflow-hidden rounded-sm"
          >
            <Image
              src={SKIN_HERO}
              alt="Korean skincare products"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Our Focus · K-Beauty
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
              Korean skincare, done properly
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Lorraine Beauté is built around authentic K-beauty: serums, toners,
              moisturisers, SPF, and masks that deliver real glass-skin results.
              Every product in the shop comes from your live K-Dropshipping catalog.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Pair your routine with our free AI Skin Analysis for personalised picks
              from the same catalog you sell.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 border border-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Shop All Products
              </Link>
              <Link
                href="/skin-analysis"
                className="inline-flex items-center justify-center gap-2 border border-accent text-accent px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent hover:text-white transition-colors"
              >
                Free Skin Analysis
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
