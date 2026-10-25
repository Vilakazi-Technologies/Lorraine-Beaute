"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart-context";
import { cn, STORE_NAME } from "@/lib/utils";
import { AnnouncementBar } from "./announcement-bar";

const primaryNav = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=skincare", label: "Skincare" },
];

const allProductsDropdown = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=serums", label: "Serums & Essences" },
  { href: "/shop?category=cleansers", label: "Cleansers" },
  { href: "/shop?category=moisturisers", label: "Moisturisers" },
  { href: "/shop?category=suncare", label: "SPF & Sun Care" },
  { href: "/shop?category=masks", label: "Masks & Treatments" },
  { href: "/shop?category=sets", label: "K-Beauty Sets" },
  { href: "/shop?category=lips", label: "Makeup & Lips" },
];

type NavLink = {
  href: string;
  label: string;
  highlight?: boolean;
};

function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn("brand-logo text-accent-dark", className)}>{STORE_NAME}</span>
  );
}

function AllProductsDropdown({
  isActive,
}: {
  isActive: (href: string) => boolean;
}) {
  const shopActive = allProductsDropdown.some((item) => isActive(item.href));

  return (
    <div className="relative group/dropdown">
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 text-sm tracking-wide uppercase transition-colors py-2",
          shopActive ? "text-accent font-medium" : "text-muted-foreground group-hover/dropdown:text-accent"
        )}
        aria-haspopup="true"
        aria-expanded="false"
      >
        All Products
        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/dropdown:rotate-180" />
      </button>

      <div
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 pt-2",
          "opacity-0 invisible translate-y-1",
          "group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0",
          "transition-all duration-200 ease-out pointer-events-none group-hover/dropdown:pointer-events-auto"
        )}
      >
        <div className="bg-card border border-border rounded-sm shadow-xl py-2 min-w-[15.5rem] overflow-hidden">
          {allProductsDropdown.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-5 py-2.5 text-sm tracking-wide transition-colors",
                isActive(item.href)
                  ? "text-accent bg-rose/40 font-medium"
                  : "text-foreground/80 hover:bg-muted hover:text-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenuPortal({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[300] lg:hidden"
            onClick={onClose}
            aria-label="Close menu overlay"
          />
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 w-[min(88vw,22rem)] bg-background z-[301] lg:hidden flex flex-col shadow-2xl"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <BrandLogo className="text-[1.75rem] sm:text-[2rem]" />
              <button
                type="button"
                className="p-2 -mr-2"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-0.5 mb-6">
                {primaryNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "text-base tracking-wide py-3 border-b border-border flex items-center gap-2",
                      isActive(link.href) && "text-accent font-medium",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                All Products
              </p>
              <div className="flex flex-col gap-0.5">
                {allProductsDropdown.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "text-sm tracking-wide py-2.5 pl-3 border-b border-border/60",
                      isActive(link.href) ? "text-accent font-medium" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/shop") return pathname === "/shop" && !category;
    if (!href.includes("category=")) return pathname === href;
    const cat = href.split("category=")[1];
    return pathname === "/shop" && category === cat;
  };

  return (
    <>
      <header className="sticky top-0 z-[100] bg-background border-b border-border shadow-sm">
        <AnnouncementBar />

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 h-12">
            <button
              type="button"
              className="p-2 -ml-2 shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                className="p-2 relative"
                onClick={openCart}
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-center px-4 pb-2.5 pt-0.5 border-b border-border/60">
            <Link href="/" className="inline-block overflow-visible">
              <BrandLogo />
            </Link>
          </div>
        </div>

        {/* Desktop — 3-column grid prevents overlap */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 xl:px-8">
            <div className="grid grid-cols-[minmax(0,11rem)_1fr_minmax(0,7rem)] xl:grid-cols-[minmax(0,13rem)_1fr_minmax(0,8rem)] items-center h-[4.75rem] xl:h-20 gap-4 xl:gap-8">
              <Link href="/" className="overflow-visible py-1 justify-self-start">
                <BrandLogo className="!text-[1.85rem] xl:!text-[2.15rem] !px-0" />
              </Link>

              <nav className="flex items-center justify-center gap-6 xl:gap-10">
                {primaryNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm tracking-wide uppercase transition-colors hover:text-accent flex items-center gap-1.5 whitespace-nowrap",
                      isActive(link.href) ? "text-accent font-medium" : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <AllProductsDropdown isActive={isActive} />
              </nav>

              <div className="flex items-center justify-end gap-0.5 shrink-0">
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Account">
                  <User className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2 relative text-muted-foreground hover:text-foreground transition-colors"
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
        </div>
      </header>

      <MobileMenuPortal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isActive={isActive}
      />
    </>
  );
}

export function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderInner />
    </Suspense>
  );
}
