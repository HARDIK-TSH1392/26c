import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { getStockMap } from "@/lib/stock";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const stockMap = await getStockMap();
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <main>
      <ProductDetail product={product} inStock={stockMap[product.slug] !== false} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <h2 className="text-lg font-bold uppercase tracking-wide mb-4 border-t border-line pt-8">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {related.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              inStock={stockMap[p.slug] !== false}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
