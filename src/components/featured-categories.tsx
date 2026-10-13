"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ScanFace } from "lucide-react";
import { SKIN_HERO } from "@/lib/products";

export function FeaturedCategories() {
  return (
    <section className="py-12 sm:py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/shop"
              className="group block relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-sm"
            >
              <Image
                src={SKIN_HERO}
                alt="Korean skincare"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
                <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/70 mb-2">
                  K-Dropshipping Catalog
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-2">
                  Korean Skincare
                </h2>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-wide uppercase text-white/90 group-hover:text-white">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <Link
              href="/skin-analysis"
              className="group block relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-sm bg-accent-dark"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/90 to-accent-dark" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
                <ScanFace className="w-12 h-12 mb-4 opacity-90" />
                <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/70 mb-2">
                  Free · Personalised
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-2">
                  AI Skin Analysis
                </h2>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-wide uppercase text-white/90 group-hover:text-white">
                  Start Scan <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
