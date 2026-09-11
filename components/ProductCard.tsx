"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useGreenLeavesSale } from "@/lib/green-leaves-context";
import { SALE_DISCOUNT_PERCENT, getSalePrice } from "@/lib/green-leaves-sale";
import { useCurrency } from "@/lib/currency-context";
import { money, usdPrice, usdMrp, usdSalePrice } from "@/lib/currency";
import MushroomDoodle from "@/components/MushroomDoodle";

export default function ProductCard({
  product,
  inStock = true,
}: {
  product: Product;
  inStock?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { active: saleActive } = useGreenLeavesSale();
  const { isIndia } = useCurrency();
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );
  const salePrice = getSalePrice(product.mrp);
  const displayPrice = isIndia ? product.price : usdPrice(product.price);
  const displayMrp = isIndia ? product.mrp : usdMrp(product.price, product.mrp);
  const displaySalePrice = isIndia
    ? salePrice
    : usdSalePrice(product.price, product.mrp);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative aspect-[3/4] bg-white overflow-hidden border ${
          saleActive ? "border-green-700 ring-2 ring-green-700" : "border-line"
        }`}
      >
        {product.badge && !saleActive && (
          <span className="absolute top-2 left-2 z-10 bg-ink text-paper text-[10px] font-bold uppercase tracking-wide px-2 py-1">
            {product.badge}
          </span>
        )}
        {saleActive && (
          <span className="absolute top-2 left-2 z-10 bg-green-700 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 animate-pulse flex items-center gap-1">
            <MushroomDoodle seed={1} className="w-4 h-4" />
            Green Leaves
          </span>
        )}
        {!inStock ? (
          <span className="absolute top-2 right-2 z-10 bg-ink text-paper text-[10px] font-bold px-2 py-1">
            OUT OF STOCK
          </span>
        ) : (
          <span
            className={`absolute top-2 right-2 z-10 text-white text-[10px] font-bold px-2 py-1 ${
              saleActive ? "bg-green-700" : "bg-accent"
            }`}
          >
            {saleActive ? `${SALE_DISCOUNT_PERCENT}% OFF` : `${discount}% OFF`}
          </span>
        )}
        <Image
          src={product.images.frontCard}
          alt={`${product.name} — ${product.colorway}, worn`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-opacity duration-300 ${
            hovered ? "opacity-0" : "opacity-100"
          } ${!inStock ? "grayscale opacity-60" : ""}`}
        />
        <Image
          src={product.images.flatCard}
          alt={`${product.name} — ${product.colorway}`}
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
          {saleActive ? (
            <>
              <span className="text-sm font-bold text-green-700">
                {money(displaySalePrice, isIndia)}
              </span>
              <span className="text-xs text-ink/40 line-through">
                {money(displayMrp, isIndia)}
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-bold">
                {money(displayPrice, isIndia)}
              </span>
              <span className="text-xs text-ink/40 line-through">
                {money(displayMrp, isIndia)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
