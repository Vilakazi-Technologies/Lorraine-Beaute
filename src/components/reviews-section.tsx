"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { reviews } from "@/lib/products";

/** Home reviews — K-beauty only (exclude legacy demo fragrance / makeup SKUs). */
const EXCLUDED_REVIEW_PRODUCT_IDS = new Set(["11", "12", "13", "14", "15", "16", "17", "18"]);
const storefrontReviews = reviews.filter((r) => !EXCLUDED_REVIEW_PRODUCT_IDS.has(r.productId));

export function ReviewsSection() {
  return (
    <section className="py-20 sm:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Customer Reviews
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold">
            Real Results from K-Beauty Lovers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storefrontReviews.slice(0, 6).map((review, i) => (
            <motion.blockquote
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-8 rounded-sm border border-border"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-serif text-xl italic leading-relaxed mb-6 text-foreground/90">
                &ldquo;{review.body}&rdquo;
              </p>
              <footer className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-xs text-sage">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
