"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { products } from "@/data/products";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, removeLine, setQty, subtotal } =
    useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-paper z-50 flex flex-col shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-line">
          <h2 className="font-bold uppercase tracking-wide text-sm">
            Your Bag ({lines.reduce((n, l) => n + l.qty, 0)})
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-xl">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {lines.length === 0 && (
            <p className="text-sm text-ink/50 mt-10 text-center">
              Your bag is empty.
            </p>
          )}
          {lines.map((line) => {
            const product = products.find((p) => p.slug === line.slug);
            if (!product) return null;
            return (
              <div key={`${line.slug}-${line.size}`} className="flex gap-3">
                <div className="relative w-20 h-24 shrink-0 bg-white border border-line">
                  <Image
                    src={product.images.flatCard}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-ink/50 text-xs">
                        {product.colorway} · Size {line.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeLine(line.slug, line.size)}
                      className="text-ink/40 hover:text-accent text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-line">
                      <button
                        className="w-7 h-7 text-sm"
                        onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm">{line.qty}</span>
                      <button
                        className="w-7 h-7 text-sm"
                        onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold">
                      ₹{product.price * line.qty}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-line px-5 py-5 space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`block text-center w-full py-3.5 text-sm font-bold uppercase tracking-wide transition-colors ${
              lines.length === 0
                ? "bg-ink/20 text-white pointer-events-none"
                : "bg-ink text-white hover:bg-accent"
            }`}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
