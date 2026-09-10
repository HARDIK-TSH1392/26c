import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="relative w-24 h-20 mb-3">
            <Image
              src="/logo/26c-logo-color2-large.webp"
              alt="26c"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="text-paper/60 max-w-xs">
            Hand-drawn graphic tees. Oversized fits, 100% cotton, printed in
            small batches.
          </p>
        </div>
        <div>
          <div className="uppercase tracking-wide text-xs text-paper/50 mb-3">
            Shop
          </div>
          <ul className="space-y-2 text-paper/80">
            <li>All Tees</li>
            <li>New Drops</li>
            <li>Bestsellers</li>
          </ul>
        </div>
        <div>
          <div className="uppercase tracking-wide text-xs text-paper/50 mb-3">
            Help
          </div>
          <ul className="space-y-2 text-paper/80">
            <li>Size Guide</li>
            <li>Shipping &amp; Returns</li>
            <li>Track Order</li>
          </ul>
        </div>
        <div>
          <div className="uppercase tracking-wide text-xs text-paper/50 mb-3">
            Company
          </div>
          <ul className="space-y-2 text-paper/80">
            <li>About 26c</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 text-center text-xs text-paper/40 py-5">
        © {new Date().getFullYear()} 26c. All rights reserved.
      </div>
    </footer>
  );
}
