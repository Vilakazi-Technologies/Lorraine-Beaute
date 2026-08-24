"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { STORE_NAME } from "@/lib/utils";

const SCROLL_KEY = "lorraine-beaute-scroll";

const LOGO_CLASS =
  "font-cursive text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-accent-dark leading-none";

function CursiveTypewriter({ onComplete }: { onComplete: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "exit">("typing");
  const letters = STORE_NAME;

  useEffect(() => {
    if (phase !== "typing") return;

    if (displayed.length < letters.length) {
      const char = letters[displayed.length];
      const delay =
        char === " " ? 220 : char === "é" ? 160 : 110 + Math.random() * 40;

      const timer = setTimeout(() => {
        setDisplayed(letters.slice(0, displayed.length + 1));
      }, delay);

      return () => clearTimeout(timer);
    }

    const holdTimer = setTimeout(() => setPhase("hold"), 500);
    return () => clearTimeout(holdTimer);
  }, [displayed, phase, letters]);

  useEffect(() => {
    if (phase !== "hold") return;
    const exitTimer = setTimeout(() => setPhase("exit"), 1600);
    return () => clearTimeout(exitTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const doneTimer = setTimeout(onComplete, 800);
    return () => clearTimeout(doneTimer);
  }, [phase, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#faf7f2]"
      initial={{ opacity: 1 }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-label="Loading Lorraine Beauté"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-rose/25 via-transparent to-cream/40 pointer-events-none" />

      <div className="relative text-center px-6 min-h-[1.2em]">
        <p className={LOGO_CLASS}>{displayed}</p>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: phase === "hold" || phase === "exit" ? 0.55 : 0,
          y: phase === "hold" || phase === "exit" ? 0 : 6,
        }}
        transition={{ duration: 0.45 }}
        className="mt-8 text-[10px] sm:text-xs tracking-[0.35em] uppercase text-muted-foreground"
      >
        Curated beauty, personalised for you
      </motion.p>
    </motion.div>
  );
}

export function PreloaderGate({
  children,
  onPreloaderComplete,
}: {
  children: React.ReactNode;
  onPreloaderComplete?: () => void;
}) {
  const pathname = usePathname();
  const skipPreloader = pathname.startsWith("/quotation");
  const [showStore, setShowStore] = useState(skipPreloader);

  useEffect(() => {
    if (skipPreloader) {
      onPreloaderComplete?.();
      return;
    }

    const saveScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };
    window.addEventListener("beforeunload", saveScroll);
    return () => window.removeEventListener("beforeunload", saveScroll);
  }, [skipPreloader, onPreloaderComplete]);

  const handleComplete = useCallback(() => {
    setShowStore(true);
    onPreloaderComplete?.();

    requestAnimationFrame(() => {
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (saved) {
        window.scrollTo(0, parseInt(saved, 10));
        sessionStorage.removeItem(SCROLL_KEY);
      }
    });
  }, [onPreloaderComplete]);

  if (skipPreloader) {
    return <>{children}</>;
  }

  return (
    <>
      {!showStore && (
        <div className="fixed inset-0 z-[9998] bg-[#faf7f2]" aria-hidden />
      )}

      <AnimatePresence mode="wait">
        {!showStore && (
          <CursiveTypewriter key="intro" onComplete={handleComplete} />
        )}
      </AnimatePresence>

      {showStore && (
        <motion.div
          key="store"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
