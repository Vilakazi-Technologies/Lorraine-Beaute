"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search, User, ScanFace } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { cn, STORE_NAME, FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/skin-analysis", label: "Skin Analysis", highlight: true },
  { href: "/shop?category=lips", label: "Lips" },
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=fragrance", label: "Fragrance" },
  { href: "/shop?category=sets", label: "Gift Sets" },
];

export function AnnouncementBar() {
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD);
  return (
    <div className="bg-accent-dark text-white text-center py-2.5 text-xs tracking-[0.2em] uppercase font-medium overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="inline-block px-8">Free shipping on orders over {threshold}</span>
        <span className="inline-block px-8">✦</span>
        <span className="inline-block px-8">Try our AI Skin Analysis — free personalised recommendations</span>
        <span className="inline-block px-8">✦</span>
        <span className="inline-block px-8">15% off your first order — code WELCOME15</span>
        <span className="inline-block px-8">✦</span>
        <span className="inline-block px-8">Free shipping on orders over {threshold}</span>
        <span className="inline-block px-8">✦</span>
        <span className="inline-block px-8">Try our AI Skin Analysis — free personalised recommendations</span>
        <span className="inline-block px-8">✦</span>
        <span className="inline-block px-8">15% off your first order — code WELCOME15</span>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <AnnouncementBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <span className="font-cursive text-3xl sm:text-4xl text-accent-dark leading-none">
              {STORE_NAME}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm tracking-wide uppercase transition-colors hover:text-accent flex items-center gap-1.5",
                  pathname === link.href ? "text-accent" : "text-muted-foreground",
                  link.highlight && "text-accent font-medium"
                )}
              >
                {link.highlight && <ScanFace className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 hidden sm:block" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hidden sm:block" aria-label="Account">
              <User className="w-5 h-5" />
            </button>
            <button
              className="p-2 relative"
              onClick={openCart}
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-background z-50 p-6 lg:hidden"
            >
              <button
                className="absolute top-6 right-6 p-2"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="font-cursive text-3xl text-accent-dark mb-8">{STORE_NAME}</p>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-lg tracking-wide py-2 border-b border-border flex items-center gap-2",
                      link.highlight && "text-accent font-medium"
                    )}
                  >
                    {link.highlight && <ScanFace className="w-4 h-4" />}
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
