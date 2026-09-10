import Link from "next/link";
import { products } from "@/data/products";
import { upcomingDesigns } from "@/data/upcoming";
import ShopGrid from "@/components/ShopGrid";
import ComingSoonCard from "@/components/ComingSoonCard";
import HomeHero from "@/components/HomeHero";
import { getStockMap } from "@/lib/stock";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stockMap = await getStockMap();

  return (
    <main>
      <HomeHero />

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
