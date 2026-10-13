"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScanFace, ArrowRight } from "lucide-react";

export function SkinAnalysisBanner() {
  return (
    <section className="py-16 sm:py-20 bg-accent-dark text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-dark via-accent-dark/95 to-accent/40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <ScanFace className="w-5 h-5 text-gold" />
              <p className="text-xs tracking-[0.3em] uppercase text-white/60">
                Our Unique Feature
              </p>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold mb-4 leading-tight">
              AI Skin Analysis — Free & Personalised
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Scan your face for a complete digital skin assessment. Claude AI analyses your
              skin type and concerns, then recommends the perfect Korean skincare products
              tailored just for you.
            </p>
            <Link
              href="/skin-analysis"
              className="inline-flex items-center gap-2 bg-white text-accent-dark px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-cream transition-colors"
            >
              Start Free Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {["Skin Type", "Concerns", "Expert Tips", "Products"].map((step, i) => (
              <div
                key={step}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-sm p-5 text-center"
              >
                <p className="text-gold text-2xl font-serif mb-1">{i + 1}</p>
                <p className="text-sm tracking-wide">{step}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
