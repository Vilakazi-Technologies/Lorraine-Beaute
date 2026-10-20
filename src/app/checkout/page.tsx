"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { CheckoutAiCoach } from "@/components/checkout-ai-coach";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 89;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      await fetch("/api/claude/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: form.get("email"),
          customerName: `${form.get("firstName")} ${form.get("lastName")}`,
          items: items.map((i) => ({
            sku: i.product.sku,
            quantity: i.quantity,
            price: i.product.price,
          })),
          total,
          shippingAddress: {
            line1: form.get("address"),
            city: form.get("city"),
            state: form.get("state"),
            postalCode: form.get("zip"),
            country: form.get("country") ?? "ZA",
          },
        }),
      });

      clearCart();
      setSubmitted(true);
    } catch {
      /* demo mode — still show success */
      clearCart();
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !submitted) {
    return (
      <main className="py-20 text-center">
        <p className="text-muted-foreground mb-6">Your bag is empty</p>
        <Link href="/shop" className="text-accent text-sm tracking-wide uppercase font-medium">
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center px-4"
        >
          <CheckCircle className="w-16 h-16 text-sage mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-semibold mb-4">Thank You!</h1>
          <p className="text-muted-foreground mb-8">
            Your order has been placed successfully. You&apos;ll receive a confirmation email shortly.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-accent text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="py-8 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            <CheckoutAiCoach subtotal={subtotal} />
            <section>
              <h2 className="text-sm tracking-[0.2em] uppercase font-medium mb-4">Contact</h2>
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="w-full border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent"
              />
            </section>

            <section>
              <h2 className="text-sm tracking-[0.2em] uppercase font-medium mb-4">Shipping</h2>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" required placeholder="First name" className="border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent" />
                <input name="lastName" required placeholder="Last name" className="border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent" />
              </div>
              <input name="address" required placeholder="Address" className="w-full mt-4 border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <input name="city" required placeholder="City" className="border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent" />
                <input name="state" required placeholder="State" className="border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent" />
                <input name="zip" required placeholder="ZIP" className="border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent" />
              </div>
              <input name="country" defaultValue="ZA" className="w-full mt-4 border border-border rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-accent" />
            </section>

            <section>
              <h2 className="text-sm tracking-[0.2em] uppercase font-medium mb-4">Payment</h2>
              <div className="border border-border rounded-sm p-6 text-center text-muted-foreground text-sm">
                <Lock className="w-5 h-5 mx-auto mb-2" />
                Secure payment processing — demo mode
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : `Place Order — ${formatPrice(total)}`}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-muted/50 border border-border rounded-sm p-6 sticky top-28">
              <h2 className="text-sm tracking-[0.2em] uppercase font-medium mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-14 h-16 bg-muted rounded-sm overflow-hidden shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white text-[10px] rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
