"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { useGreenLeavesSale } from "@/lib/green-leaves-context";
import { SALE_DISCOUNT_PERCENT, getSalePrice } from "@/lib/green-leaves-sale";
import MushroomDoodle from "@/components/MushroomDoodle";

export default function ProductDetail({
  product,
  inStock = true,
}: {
  product: Product;
  inStock?: boolean;
}) {
  const gallery = [
    { key: "flat", src: product.images.flat, label: "Flat" },
    { key: "closeup", src: product.images.closeup, label: "Print" },
    { key: "front", src: product.images.front, label: "Front" },
    { key: "back", src: product.images.back, label: "Back" },
  ];
  const [active, setActive] = useState(gallery[0]);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const { addLine } = useCart();
  const { active: saleActive, secondsRemaining } = useGreenLeavesSale();
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );
  const salePrice = getSalePrice(product.mrp);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid md:grid-cols-2 gap-10">
      <div>
        <div className="relative aspect-[3/4] bg-white border border-line">
          <Image
            src={active.src}
            alt={`${product.name} — ${active.label}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3">
          {gallery.map((g) => (
            <button
              key={g.key}
              onClick={() => setActive(g)}
              className={`relative aspect-square bg-white border ${
                active.key === g.key ? "border-ink" : "border-line"
              }`}
            >
              <Image
                src={g.src}
                alt={g.label}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md">
        <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">
          26c · {product.category}
        </p>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-ink/60 mt-1">{product.colorway}</p>

        {saleActive && (
          <div className="mt-4 bg-green-700 text-white px-3 py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-1.5">
              <MushroomDoodle seed={2} className="w-5 h-5" />
              Green Leaves Sale — {SALE_DISCOUNT_PERCENT}% off
            </span>
            <span className="font-mono">
              {Math.floor(secondsRemaining / 60)}:
              {String(secondsRemaining % 60).padStart(2, "0")}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3 mt-4">
          {saleActive ? (
            <>
              <span className="text-2xl font-bold text-green-700">
                ₹{salePrice}
              </span>
              <span className="text-base text-ink/40 line-through">
                ₹{product.mrp}
              </span>
              <span className="text-sm font-semibold text-green-700">
                {SALE_DISCOUNT_PERCENT}% off
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold">₹{product.price}</span>
              <span className="text-base text-ink/40 line-through">
                ₹{product.mrp}
              </span>
              {inStock ? (
                <span className="text-sm font-semibold text-accent">
                  {discount}% off
                </span>
              ) : (
                <span className="text-sm font-semibold text-ink/50">
                  Out of Stock
                </span>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-ink/50 mt-1">Inclusive of all taxes</p>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wide">
              Select Size
            </span>
            <Link
              href="/size-guide"
              target="_blank"
              className="text-xs underline text-ink/60"
            >
              Size Guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
                className={`w-12 h-11 border text-sm font-medium transition-colors ${
                  size === s
                    ? "bg-ink text-paper border-ink"
                    : "border-line hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p className="text-xs text-accent mt-2">
              Please select a size before adding to bag.
            </p>
          )}
        </div>

        <button
          onClick={() => {
            if (!size) return setError(true);
            addLine(product.slug, size);
          }}
          disabled={!inStock}
          className="mt-6 w-full py-4 bg-ink text-paper text-sm font-bold uppercase tracking-wide hover:bg-accent transition-colors disabled:opacity-40 disabled:hover:bg-ink disabled:cursor-not-allowed"
        >
          {inStock ? "Add to Bag" : "Out of Stock"}
        </button>

        <div className="mt-8 border-t border-line pt-6 space-y-4 text-sm">
          <p className="text-ink/80">{product.description}</p>
          <dl className="grid grid-cols-2 gap-y-2 text-ink/70">
            <dt className="text-ink/50">Fit</dt>
            <dd>{product.fit}</dd>
            <dt className="text-ink/50">Fabric</dt>
            <dd>{product.fabric}</dd>
            <dt className="text-ink/50">Print</dt>
            <dd>{product.printType}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
