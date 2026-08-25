"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistContextType {
  items: string[];
  toggle: (id: string) => void;
  isLiked: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("wishlist", JSON.stringify(items));
    }
  }, [items, loaded]);

  const toggle = useCallback((id: string) => {
    setItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const isLiked = useCallback((id: string) => items.includes(id), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, isLiked, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
