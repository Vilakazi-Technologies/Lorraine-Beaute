"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { recentPurchases } from "@/lib/products";

export function RecentlyPurchased() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % recentPurchases.length);
        setVisible(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, [visible]);

  const purchase = recentPurchases[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-24 left-4 z-40 max-w-xs"
        >
          <div className="bg-card border border-border rounded-sm shadow-lg p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-sage" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {purchase.name} from {purchase.city}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                purchased {purchase.product}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {purchase.minutesAgo} minutes ago
              </p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="p-1 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
