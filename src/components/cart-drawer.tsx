"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useCatalog } from "@/lib/catalog-context";
import { getUpsellProducts } from "@/lib/catalog-helpers";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export function CartDrawer() {
  const { products: catalog } = useCatalog();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    showUpsell,
    lastAddedProduct,
    addItem,
    setShowUpsell,
  } = useCart();

  const upsells = lastAddedProduct ? getUpsellProducts(lastAddedProduct, catalog) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[55]"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[56] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl font-semibold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Bag ({items.length})
              </h2>
              <button onClick={closeCart} aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-6">Your bag is empty</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 text-accent text-sm tracking-wide uppercase font-medium"
                  >
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-muted rounded-sm overflow-hidden shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="p-1.5"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="p-1.5"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-xs text-muted-foreground hover:text-accent transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="font-medium text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}

                  {showUpsell && upsells.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose/50 border border-border rounded-sm p-5 mt-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs tracking-[0.2em] uppercase font-medium text-accent">
                          Complete Your Look
                        </p>
                        <button
                          onClick={() => setShowUpsell(false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {upsells.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 mb-3 last:mb-0">
                          <div className="relative w-14 h-16 bg-muted rounded-sm overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => addItem(product)}
                            className="text-xs bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-dark transition-colors shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Shipping calculated at checkout. Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-accent text-white text-center py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent-dark transition-colors"
                >
                  Checkout — {formatPrice(subtotal)}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
