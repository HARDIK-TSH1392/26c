"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";

export default function ProductCard({
  product,
  inStock = true,
}: {
  product: Product;
  inStock?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-white overflow-hidden border border-line">
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-ink text-paper text-[10px] font-bold uppercase tracking-wide px-2 py-1">
            {product.badge}
          </span>
        )}
        {!inStock ? (
          <span className="absolute top-2 right-2 z-10 bg-ink text-paper text-[10px] font-bold px-2 py-1">
            OUT OF STOCK
          </span>
        ) : (
          <span className="absolute top-2 right-2 z-10 bg-accent text-white text-[10px] font-bold px-2 py-1">
            {discount}% OFF
          </span>
        )}
        <Image
          src={product.images.flatCard}
          alt={`${product.name} — ${product.colorway}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-opacity duration-300 ${
            hovered ? "opacity-0" : "opacity-100"
          } ${!inStock ? "grayscale opacity-60" : ""}`}
        />
        <Image
          src={product.images.frontCard}
          alt={`${product.name} — ${product.colorway}, worn`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          } ${!inStock ? "grayscale opacity-60" : ""}`}
        />
      </div>
      <div className="mt-3 space-y-0.5">
        <p className="text-[11px] uppercase tracking-wide text-ink/50">
          26c · {product.colorway}
        </p>
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm font-bold">₹{product.price}</span>
          <span className="text-xs text-ink/40 line-through">
            ₹{product.mrp}
          </span>
        </div>
      </div>
    </Link>
  );
}
