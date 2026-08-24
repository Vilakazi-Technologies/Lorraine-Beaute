"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const igPosts = [
  "https://images.unsplash.com/photo-1586495777744-4413d210b935?w=400&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  "https://images.unsplash.com/photo-1631214524020-7e146d5d65a9?w=400&q=80",
  "https://images.unsplash.com/photo-1620916566568-2440574f5d9c?w=400&q=80",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
  "https://images.unsplash.com/photo-1571781926291-c477eb30eed6?w=400&q=80",
];

export function InstagramGallery() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 flex items-center justify-center gap-2">
            <Instagram className="w-4 h-4" />
            @lorrainebeauty
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold">
            Shop Our IG
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {igPosts.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-square overflow-hidden rounded-sm group cursor-pointer"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-accent-dark/0 group-hover:bg-accent-dark/30 transition-colors flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
