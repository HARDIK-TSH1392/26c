"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import AccountMenu from "@/components/AccountMenu";

export default function SiteHeader() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-paper">
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="relative w-24 h-12 shrink-0">
            <Image
              src="/logo/26c-logo-color2.webp"
              alt="26c"
              fill
              className="object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wide">
            <Link href="/" className="hover:text-accent transition-colors">
              All Tees
            </Link>
            <Link
              href="/new-drops"
              className="hover:text-accent transition-colors"
            >
              New Drops
            </Link>
          </nav>

          <div className="flex items-center gap-5">
            <AccountMenu />
            <button
              aria-label="Open cart"
              onClick={openCart}
              className="relative flex items-center gap-2 text-sm font-medium uppercase tracking-wide"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
