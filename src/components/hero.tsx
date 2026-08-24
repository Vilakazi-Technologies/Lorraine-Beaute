"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80"
          alt="Lorraine Beauty collection"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent-dark/80 via-accent-dark/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-white"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 text-white/70">
            Just Dropped
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-6">
            Plumping Matte Collection
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-md">
            The iconic lip kit in plumping formulas with a lightweight, matte finish.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-accent-dark px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-cream transition-colors"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/product/plumping-matte-lip-kit"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-white/10 transition-colors"
            >
              View Collection
            </Link>
            <Link
              href="/skin-analysis"
              className="inline-flex items-center gap-2 border border-gold/60 text-gold px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-gold/10 transition-colors"
            >
              Free Skin Analysis
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
