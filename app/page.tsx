import Link from "next/link";
import { products } from "@/data/products";
import { upcomingDesigns } from "@/data/upcoming";
import ShopGrid from "@/components/ShopGrid";
import ComingSoonCard from "@/components/ComingSoonCard";
import HeroCarousel from "@/components/HeroCarousel";
import { getStockMap } from "@/lib/stock";

export default async function Home() {
  const stockMap = await getStockMap();

  return (
    <main>
      <section className="relative bg-ink text-paper overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
          <p className="uppercase tracking-[0.3em] text-xs text-paper/60 mb-4">
            26c Graphic Tees
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-[0.95] max-w-2xl">
            Hand-drawn prints.
            <br />
            Oversized fits.
          </h1>
          <p className="mt-5 max-w-md text-paper/70 text-sm md:text-base">
            100% cotton, small-batch printed tees. Six drops, live now.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            All Tees
          </h2>
        </div>
        <ShopGrid products={products} stockMap={stockMap} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 border-t border-line">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            New Drops — Coming Soon
          </h2>
          <Link
            href="/new-drops"
            className="text-xs underline text-ink/60 shrink-0"
          >
            View all
          </Link>
        </div>
        <p className="text-xs text-ink/50 mb-6">
          Design concepts in the works — not purchasable yet.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {upcomingDesigns.slice(0, 4).map((design) => (
            <ComingSoonCard key={design.id} design={design} />
          ))}
        </div>
      </div>
    </main>
  );
}
