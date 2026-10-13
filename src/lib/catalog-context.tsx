"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";
interface CatalogContextValue {
  products: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
  lastSynced: string | null;
}

const CatalogContext = createContext<CatalogContextValue>({
  products: [],
  loading: true,
  refresh: async () => {},
  lastSynced: null,
});

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
        setLastSynced(data.updatedAt ?? null);
      }
    } catch {
      /* keep last catalog */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const value = useMemo(
    () => ({ products, loading, refresh, lastSynced }),
    [products, loading, refresh, lastSynced]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
