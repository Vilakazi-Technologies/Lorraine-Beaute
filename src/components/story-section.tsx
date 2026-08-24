"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
              alt="Our story"
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
              Our Story
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-6">
              Bring surprise and delight to your every day
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              What began with a passion for clean, luxurious beauty has inspired our curated
              collections. Each product is thoughtfully crafted to elevate your daily rituals
              — from morning skincare to evening fragrance.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We believe beauty should feel effortless, indulgent, and uniquely yours.
              Every formula is designed with premium ingredients and a commitment to
              sustainability.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Explore the Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
