import { products } from "@/data/products";
import ShopGrid from "@/components/ShopGrid";
import HomeHero from "@/components/HomeHero";
import { getStockMap } from "@/lib/stock";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stockMap = await getStockMap();

  return (
    <main>
      <HomeHero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <ShopGrid products={products} stockMap={stockMap} />
      </div>
    </main>
  );
}
