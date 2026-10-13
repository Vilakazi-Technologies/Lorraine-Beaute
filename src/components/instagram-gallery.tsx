"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";

const captions = [
  "Glass skin starts here ✨",
  "Propolis glow is real",
  "SPF every single day ☀️",
  "Calm skin season",
  "K-beauty ritual",
  "New in from Korea",
];

export function InstagramGallery() {
  const { products } = useCatalog();
  const igPosts = products.slice(0, 6).map((p, i) => ({
    src: p.image,
    alt: p.name,
    caption: captions[i % captions.length],
    href: `/product/${p.slug}`,
    likes: `${Math.floor(400 + (p.reviewCount % 900))}`,
  }));

  if (igPosts.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-cream/50">
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
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold mb-3">
            Shop Our IG
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Daily K-beauty inspiration, routines &amp; new arrivals — tap to shop the look
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {igPosts.map((post, i) => (
            <motion.div
              key={post.href}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={post.href}
                className="group relative block aspect-square overflow-hidden rounded-sm bg-muted"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-[10px] sm:text-xs line-clamp-2">{post.caption}</p>
                  <span className="text-white/80 text-[10px] flex items-center gap-1 mt-1">
                    <Heart className="w-3 h-3 fill-white" />
                    {post.likes}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
