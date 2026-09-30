import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const SITE_URL = "https://26c.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    // /new-drops and /bestsellers are intentionally excluded — unlinked
    // from navigation, so shouldn't be in the sitemap either.
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/help`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/size-guide`, changeFrequency: "monthly", priority: 0.3 },
    // privacy/terms are intentionally excluded — noindexed as thin
    // boilerplate content, so they shouldn't be in the sitemap either.
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
