"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { collections } from "@/lib/products";

const SKIP_PATHS = ["/quotation"];

function introForPath(pathname: string, category: string | null) {
  if (pathname === "/shop") {
    if (category) {
      const col =
        collections.find((c) => c.slug === category) ??
        (category === "skincare"
          ? { name: "Korean Skincare", description: "Curated K-beauty for glass skin" }
          : null);
      if (col) return { title: col.name, subtitle: col.description };
    }
    return {
      title: "The Collection",
      subtitle: "Every formula chosen for clarity, calm, and glow",
    };
  }
  if (pathname === "/skin-analysis") {
    return {
      title: "Your Skin, Decoded",
      subtitle: "Personalised recommendations in under a minute",
    };
  }
  if (pathname === "/checkout") {
    return {
      title: "Secure Checkout",
      subtitle: "Encrypted payment · Authentic products · Fast fulfilment",
    };
  }
  if (pathname === "/") {
    return null;
  }
  return {
    title: "Lorraine Beauté",
    subtitle: "Authentic Korean skincare",
  };
}

function PageIntroInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<{ title: string; subtitle: string } | null>(null);
  const prevKey = useRef<string>("");

  useEffect(() => {
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return;

    const key = `${pathname}?${category ?? ""}`;
    if (key === prevKey.current) return;
    prevKey.current = key;

    let cancelled = false;

    async function run() {
      if (pathname.startsWith("/product/")) {
        const slug = pathname.replace("/product/", "");
        try {
          const res = await fetch(`/api/catalog?slug=${encodeURIComponent(slug)}`, {
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            if (!cancelled && data.product?.name) {
              setContent({
                title: data.product.name,
                subtitle: "Authentic K-beauty · Ready to ship · Secure checkout",
              });
              setVisible(true);
              setTimeout(() => setVisible(false), 1200);
              return;
            }
          }
        } catch {
          /* fallback below */
        }
        if (!cancelled) {
          setContent({
            title: "Discover",
            subtitle: "Premium K-beauty · Authentic · Ready to ship",
          });
          setVisible(true);
          setTimeout(() => setVisible(false), 1200);
        }
        return;
      }

      const intro = introForPath(pathname, category);
      if (!intro) return;
      setContent(intro);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1100);
      return () => clearTimeout(timer);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [pathname, category]);

  return (
    <AnimatePresence>
      {visible && content && (
        <motion.div
          key={`${pathname}-${category ?? ""}-${content.title}`}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-[#faf7f2]/96 backdrop-blur-sm pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-8 max-w-lg"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-4">
              Lorraine Beauté
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-accent-dark mb-3 leading-tight">
              {content.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {content.subtitle}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageIntro() {
  return (
    <Suspense fallback={null}>
      <PageIntroInner />
    </Suspense>
  );
}
