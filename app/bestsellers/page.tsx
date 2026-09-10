import { products } from "@/data/products";
import ShopGrid from "@/components/ShopGrid";
import { getStockMap } from "@/lib/stock";

export const dynamic = "force-dynamic";

export default async function BestsellersPage() {
  const stockMap = await getStockMap();
  const bestsellers = products.filter((p) => p.badge === "Bestseller");

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <p className="uppercase tracking-[0.3em] text-xs text-ink/50 mb-3">
        Most Loved
      </p>
      <h1 className="text-3xl md:text-4xl font-black mb-3">Bestsellers</h1>
      <p className="text-sm text-ink/60 max-w-xl mb-10">
        The tees our customers keep coming back for.
      </p>
      <ShopGrid products={bestsellers} stockMap={stockMap} />
    </main>
  );
}
