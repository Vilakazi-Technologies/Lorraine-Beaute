"use client";

import { Shield, Truck, RotateCcw, Lock } from "lucide-react";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export function ProductTrustBar() {
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD);
  return (
    <div className="mb-8 rounded-sm border border-border bg-cream/80 px-4 py-3 sm:px-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Shield, text: "100% authentic K-beauty" },
          { icon: Lock, text: "Secure encrypted checkout" },
          { icon: Truck, text: `Free shipping over ${threshold}` },
          { icon: RotateCcw, text: "30-day easy returns" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs sm:text-sm text-foreground/85">
            <Icon className="w-4 h-4 text-sage shrink-0" aria-hidden />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
