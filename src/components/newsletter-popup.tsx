"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedBefore = sessionStorage.getItem("newsletter-dismissed");
    if (dismissedBefore) {
      setDismissed(true);
      return;
    }

    const timer = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
    sessionStorage.setItem("newsletter-dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90vw] max-w-md bg-card rounded-sm overflow-hidden shadow-2xl"
          >
            <div className="bg-accent-dark text-white p-8 text-center relative">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <Gift className="w-10 h-10 mx-auto mb-4 text-gold" />
              <h3 className="font-serif text-3xl font-semibold mb-2">
                Welcome to Lorraine Beauté
              </h3>
              <p className="text-white/70 text-sm">
                Join our community and receive 15% off your first order
              </p>
            </div>
            <div className="p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDismiss();
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full border border-border rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-accent text-white py-3.5 rounded-full text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent-dark transition-colors"
                >
                  Get 15% Off — Code WELCOME15
                </button>
              </form>
              <button
                onClick={handleDismiss}
                className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
