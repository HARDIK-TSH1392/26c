"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type InventoryItem = {
  slug: string;
  name: string;
  colorway: string;
  price: number;
  image: string;
  inStock: boolean;
};

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inventory")
      .then((r) => r.json())
      .then((d) => setItems(d.inventory ?? []))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (slug: string, next: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, inStock: next } : i))
    );
    await fetch(`/api/admin/inventory/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inStock: next }),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Inventory</h1>
      <p className="text-sm text-ink/60 mb-8">
        Toggle a product off to mark it out of stock — it'll show as
        unavailable and can't be added to bag on the storefront.
      </p>

      {loading && <p className="text-sm text-ink/50">Loading…</p>}

      <div className="border border-line divide-y divide-line">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-16 bg-white border border-line shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-ink/50">
                  {item.colorway} · ₹{item.price}
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <span
                className={`text-xs uppercase tracking-wide font-bold ${
                  item.inStock ? "text-green-700" : "text-accent"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <button
                onClick={() => toggle(item.slug, !item.inStock)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  item.inStock ? "bg-green-700" : "bg-ink/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    item.inStock ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
