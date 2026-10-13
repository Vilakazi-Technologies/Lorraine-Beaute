"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Minus, Plus, CheckCircle, ArrowLeft, Truck, RotateCcw, Shield, Lock } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";
import {
  getReviewsForProduct,
  getUpsellProducts,
  resolveProductBySlug,
} from "@/lib/catalog-helpers";
import { useCart } from "@/lib/cart-context";
import { formatPrice, FREE_SHIPPING_THRESHOLD, cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { ProductTrustBar } from "@/components/product-trust-bar";
import { StickyMobileCheckout } from "@/components/sticky-mobile-checkout";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { products, loading } = useCatalog();
  const product = resolveProductBySlug(slug, products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!loading && !product) notFound();
  if (!product) {
    return (
      <main className="py-20 text-center text-muted-foreground">
        Loading product…
      </main>
    );
  }

  const productReviews = getReviewsForProduct(product.id);
  const upsells = getUpsellProducts(product, products);
  const savings = product.compareAtPrice
    ? product.compareAtPrice - product.price
    : 0;

  const buyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <main className="pb-28 lg:pb-16 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ProductTrustBar />

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-accent text-white text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-medium">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-20 h-24 rounded-sm overflow-hidden border-2 transition-colors",
                      selectedImage === i ? "border-accent" : "border-transparent"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:py-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-xs text-sage font-medium">
                <Shield className="w-3.5 h-3.5" />
                Authentic · K-Dropshipping
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                Secure checkout
              </span>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(product.rating)
                      ? "fill-gold text-gold"
                      : "fill-border text-border"
                  )}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-1">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                {product.brand}
              </p>
            )}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.longDescription ?? product.description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="text-sm text-accent font-medium">
                    Save {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <div className="flex items-center border border-border rounded-full w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => addItem(product, quantity)}
                className="flex-1 border border-accent text-accent py-4 rounded-full text-sm tracking-[0.12em] uppercase font-medium hover:bg-accent/5 transition-colors"
              >
                Add to Bag
              </button>
              <button
                type="button"
                onClick={buyNow}
                className="flex-1 bg-accent text-white py-4 rounded-full text-sm tracking-[0.12em] uppercase font-medium hover:bg-accent-dark transition-colors"
              >
                Buy Now — {formatPrice(product.price * quantity)}
              </button>
            </div>

            <div className="space-y-3 border-t border-border pt-6 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-4 h-4 text-sage" />
                <span>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-4 h-4 text-sage" />
                <span>30-day hassle-free returns</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-sage" />
                <span>100% authentic products guaranteed</span>
              </div>
            </div>

            {upsells.length > 0 && (
              <div className="bg-rose/30 border border-border rounded-sm p-5">
                <p className="text-xs tracking-[0.2em] uppercase font-medium text-accent mb-4">
                  Frequently Bought Together
                </p>
                <div className="space-y-3">
                  {upsells.map((up) => (
                    <div key={up.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-muted rounded-sm overflow-hidden shrink-0">
                        <Image src={up.image} alt={up.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{up.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(up.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(up)}
                        className="text-xs border border-accent text-accent px-4 py-2 rounded-full hover:bg-accent hover:text-white transition-colors shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {productReviews.length > 0 && (
          <section className="mt-20 border-t border-border pt-16">
            <h2 className="font-serif text-3xl font-semibold mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productReviews.map((review) => (
                <div key={review.id} className="bg-card border border-border p-6 rounded-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <h3 className="font-medium mb-2">{review.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {review.body}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {review.author} — {review.location}
                    </p>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs text-sage">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20">
          <h2 className="font-serif text-3xl font-semibold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {products
              .filter((p) => {
                if (p.id === product.id) return false;
                if (product.supplier === "asever") return p.supplier === "asever";
                return p.category === product.category || p.brand === product.brand;
              })
              .slice(0, 4)
              .map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
          </div>
        </section>
      </div>

      <StickyMobileCheckout product={product} quantity={quantity} />
    </main>
  );
}
