"use client";

import { Lock, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export function TrustStrip({ compact = false }: { compact?: boolean }) {
  const items = [
    { icon: ShieldCheck, label: "100% authentic K-beauty" },
    { icon: Lock, label: "Secure encrypted checkout" },
    { icon: Truck, label: `Free shipping over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
    { icon: BadgeCheck, label: "Fulfilled via K-Dropshipping Korea" },
  ];

  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 gap-2"
          : "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      }
    >
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-cream/80 border border-border/60 rounded-sm px-3 py-2.5"
        >
          <Icon className="w-4 h-4 text-sage shrink-0" />
          <span className="leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}
