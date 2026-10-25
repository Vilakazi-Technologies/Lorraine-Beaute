"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SKIN_HERO } from "@/lib/products";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={SKIN_HERO}
          alt="Korean skincare serums and bottles — Lorraine Beauté"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent-dark/90 via-accent-dark/60 to-accent-dark/20 sm:to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-white"
        >
          <p className="text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 text-white/70">
            Authentic Korean Skincare
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.08] mb-4 sm:mb-6">
            Glass Skin Starts Here
          </h1>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-md">
            LANEIGE, Beauty of Joseon, and curated K-beauty — sourced via
            K-Dropshipping and tailored for South Africa.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-accent-dark px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm tracking-[0.15em] uppercase font-medium hover:bg-cream transition-colors"
            >
              Shop K-Beauty
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("lorraine:open-skin-analysis"))}
              className="inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm tracking-[0.15em] uppercase font-medium hover:bg-gold/10 transition-colors"
            >
              Free Skin Analysis
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
