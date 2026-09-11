import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { getStockMap } from "@/lib/stock";

export const dynamic = "force-dynamic";

const SITE_URL = "https://26c.in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = `${product.name} — ${product.colorway}`;
  const description = `${product.description} ₹${product.price} (MRP ₹${product.mrp}). ${product.fit}, ${product.fabric}.`;
  const url = `${SITE_URL}/product/${product.slug}`;
  const image = product.images.frontCard;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} — 26c`,
      description,
      images: [{ url: image, width: 1200, height: 1500, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — 26c`,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const stockMap = await getStockMap();
  const inStock = stockMap[product.slug] !== false;
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.colorway}`,
    description: product.description,
    image: [product.images.frontCard, product.images.flat, product.images.closeup],
    sku: product.id,
    brand: { "@type": "Brand", name: "26c" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "All Tees", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/product/${product.slug}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetail product={product} inStock={inStock} />
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
