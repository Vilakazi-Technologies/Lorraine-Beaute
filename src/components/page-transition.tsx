"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { revealTransition } from "@/lib/motion-tokens";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.main
      id="main-content"
      key={pathname}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={revealTransition(reducedMotion)}
    >
      {children}
    </motion.main>
  );
}
