"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const SORTS = ["Featured", "Price: Low to High", "Price: High to Low"] as const;
type Sort = (typeof SORTS)[number];

export default function ShopGrid({
  products,
  stockMap = {},
}: {
  products: Product[];
  stockMap?: Record<string, boolean>;
}) {
  const [sort, setSort] = useState<Sort>("Featured");
  const [sortOpen, setSortOpen] = useState(false);

  const visible = useMemo(() => {
    const list = [...products];
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [sort, products]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-y border-line py-3 mb-6">
        <p className="text-xs text-ink/50">{visible.length} products</p>

        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="text-xs uppercase tracking-wide px-3 py-1.5 border border-line flex items-center gap-2"
          >
            Sort: {sort}
            <span className="text-[10px]">▾</span>
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-paper border border-line z-20">
              {SORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSort(s);
                    setSortOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-xs hover:bg-line/40 ${
                    sort === s ? "font-semibold" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            inStock={stockMap[product.slug] !== false}
          />
        ))}
      </div>
    </div>
  );
}
