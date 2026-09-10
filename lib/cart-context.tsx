"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products } from "@/data/products";

export type CartLine = {
  slug: string;
  size: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (slug: string, size: string) => void;
  removeLine: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "26c-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines, hydrated]);

  const addLine = (slug: string, size: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.size === size);
      if (existing) {
        return prev.map((l) =>
          l.slug === slug && l.size === size ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { slug, size, qty: 1 }];
    });
    setIsOpen(true);
  };

  const removeLine = (slug: string, size: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.slug === slug && l.size === size))
    );
  };

  const setQty = (slug: string, size: string, qty: number) => {
    if (qty <= 0) return removeLine(slug, size);
    setLines((prev) =>
      prev.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l))
    );
  };

  const clearCart = () => setLines([]);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const product = products.find((p) => p.slug === l.slug);
        return sum + (product ? product.price * l.qty : 0);
      }, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addLine,
        removeLine,
        setQty,
        clearCart,
        count,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
