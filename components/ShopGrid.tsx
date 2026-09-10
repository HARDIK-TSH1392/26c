"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const FILTERS = ["All", "Solid Print", "Multi-Color Print", "Acid Wash Print"] as const;
type Filter = (typeof FILTERS)[number];

const SORTS = ["Featured", "Price: Low to High", "Price: High to Low"] as const;
type Sort = (typeof SORTS)[number];

export default function ShopGrid({
  products,
  stockMap = {},
}: {
  products: Product[];
  stockMap?: Record<string, boolean>;
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("Featured");
  const [sortOpen, setSortOpen] = useState(false);

  const visible = useMemo(() => {
    let list =
      filter === "All"
        ? products
        : products.filter((p) => p.printType === filter);

    list = [...list];
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);

    return list;
  }, [filter, sort, products]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs uppercase tracking-wide px-3 py-1.5 border transition-colors ${
                filter === f
                  ? "bg-ink text-paper border-ink"
                  : "border-line text-ink/60 hover:border-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

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

      <p className="text-xs text-ink/50 mb-4">{visible.length} products</p>

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
