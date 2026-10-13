"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { STORE_NAME } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-accent-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <p className="brand-logo text-white !text-[2.25rem] sm:!text-[2.5rem] mb-4">{STORE_NAME}</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Authentic Korean skincare — glass skin rituals curated for South Africa.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-white/40">Shop</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=skincare" className="hover:text-white transition-colors">Korean Skincare</Link></li>
              <li><Link href="/shop?category=serums" className="hover:text-white transition-colors">Serums & Essences</Link></li>
              <li><Link href="/shop?category=suncare" className="hover:text-white transition-colors">SPF & Suncare</Link></li>
              <li><Link href="/shop?category=masks" className="hover:text-white transition-colors">Masks</Link></li>
              <li><Link href="/shop?category=lips" className="hover:text-white transition-colors">Makeup & Lips</Link></li>
              <li><Link href="/skin-analysis" className="hover:text-white transition-colors">AI Skin Analysis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-white/40">Support</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-white/40">Stay Connected</h4>
            <p className="text-sm text-white/60 mb-4">Join for exclusive K-beauty offers and early access.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button className="bg-white text-accent-dark px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                Join
              </button>
            </form>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="text-white/50 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/50 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-white/50 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
