import Image from "next/image";
import Link from "next/link";
import LeafDoodle from "@/components/LeafDoodle";
import MushroomDoodle from "@/components/MushroomDoodle";

export default function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line bg-gradient-to-b from-ink via-ink to-green-950/70 text-paper overflow-hidden">
      <LeafDoodle
        className="absolute -top-3 right-6 w-16 h-16 text-green-600/10 rotate-12 pointer-events-none"
      />
      <MushroomDoodle
        seed={9}
        className="absolute bottom-10 left-4 w-10 h-10 text-green-600/10 pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
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
          <Link
            href="/"
            className="block uppercase tracking-wide text-xs text-paper/50 mb-3 hover:text-paper"
          >
            Shop
          </Link>
          <ul className="space-y-2 text-paper/80">
            <li>
              <Link href="/" className="hover:text-paper">
                All Tees
              </Link>
            </li>
            <li>
              <Link href="/new-drops" className="hover:text-paper">
                New Drops
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Link
            href="/help"
            className="block uppercase tracking-wide text-xs text-paper/50 mb-3 hover:text-paper"
          >
            Help
          </Link>
          <ul className="space-y-2 text-paper/80">
            <li>
              <Link href="/size-guide" className="hover:text-paper">
                Size Guide
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-paper">
                Track Order
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Link
            href="/about"
            className="block uppercase tracking-wide text-xs text-paper/50 mb-3 hover:text-paper"
          >
            Company
          </Link>
          <ul className="space-y-2 text-paper/80">
            <li>
              <Link href="/about" className="hover:text-paper">
                About 26c
              </Link>
            </li>
            <li>
              <a href="mailto:hardik@nhtech.in" className="hover:text-paper">
                hardik@nhtech.in
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-paper/10 text-center text-xs text-paper/40 py-5 group cursor-default">
        © {new Date().getFullYear()} 26c. All rights reserved.
        <span className="inline-flex items-center gap-1 ml-2 align-middle opacity-0 group-hover:opacity-60 transition-opacity duration-700">
          <LeafDoodle className="w-3 h-3 text-green-500" />
          4:20
        </span>
      </div>
    </footer>
  );
}
