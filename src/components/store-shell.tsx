"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { CartProvider } from "@/lib/cart-context";
import { PreloaderGate } from "@/components/preloader";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

const CartDrawer = dynamic(() => import("@/components/cart-drawer").then((m) => m.CartDrawer), {
  ssr: false,
});
const Chatbot = dynamic(() => import("@/components/chatbot").then((m) => m.Chatbot), {
  ssr: false,
});
const SkinAnalysisFab = dynamic(
  () => import("@/components/skin-analysis").then((m) => m.SkinAnalysisFab),
  { ssr: false }
);
const RecentlyPurchased = dynamic(
  () => import("@/components/recently-purchased").then((m) => m.RecentlyPurchased),
  { ssr: false }
);
const NewsletterPopup = dynamic(
  () => import("@/components/newsletter-popup").then((m) => m.NewsletterPopup),
  { ssr: false }
);

export function StoreShell({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <CartProvider>
      <PreloaderGate onPreloaderComplete={handlePreloaderComplete}>
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
        {preloaderDone && (
          <>
            <CartDrawer />
            <Chatbot />
            <SkinAnalysisFab />
            <RecentlyPurchased />
            <NewsletterPopup />
          </>
        )}
      </PreloaderGate>
    </CartProvider>
  );
}
