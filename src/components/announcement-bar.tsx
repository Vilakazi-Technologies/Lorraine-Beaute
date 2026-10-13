"use client";

import { useEffect, useState } from "react";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

const SEP = " · ";

export function AnnouncementBar() {
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD);
  const [mobileIndex, setMobileIndex] = useState(0);

  const messages = [
    `Free shipping over ${threshold}`,
    "Authentic Korean Skincare · LANEIGE & Beauty of Joseon",
    "15% off your first order — WELCOME15",
  ];

  const marqueeText = [
    `Authentic K-Beauty — Free shipping over ${threshold}`,
    "LANEIGE · Beauty of Joseon · Glass Skin Essentials",
    "Free AI Skin Analysis — Personalised product picks",
    "15% off your first order — code WELCOME15",
  ].join(`${SEP}✦${SEP}`);

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div
      className="bg-accent-dark text-white relative overflow-hidden"
      role="region"
      aria-label="Store announcements"
    >
      {/* Mobile & tablet: centred rotating message */}
      <div className="sm:hidden px-4 py-2.5 min-h-[2.75rem] flex items-center justify-center">
        <p
          key={mobileIndex}
          className="text-[11px] leading-snug text-center font-medium tracking-wide animate-fade-in"
        >
          {messages[mobileIndex]}
        </p>
      </div>

      {/* Desktop: smooth marquee */}
      <div className="hidden sm:block py-2.5 overflow-hidden">
        <div className="announcement-track flex w-max">
          <span className="announcement-track-inner text-xs tracking-[0.12em] uppercase font-medium whitespace-nowrap">
            {marqueeText}
            {SEP}✦{SEP}
            {marqueeText}
            {SEP}✦{SEP}
          </span>
          <span
            className="announcement-track-inner text-xs tracking-[0.12em] uppercase font-medium whitespace-nowrap"
            aria-hidden="true"
          >
            {marqueeText}
            {SEP}✦{SEP}
            {marqueeText}
            {SEP}✦{SEP}
          </span>
        </div>
      </div>
    </div>
  );
}
