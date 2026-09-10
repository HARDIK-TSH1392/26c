import { prisma } from "@/lib/prisma";

// Missing row for a slug == in stock. Only explicit `inStock: false` rows
// mark something unavailable — keeps the common case (everything in stock)
// free of needing a database row per product.
export async function getStockMap(): Promise<Record<string, boolean>> {
  const rows = await prisma.productStatus.findMany();
  const map: Record<string, boolean> = {};
  for (const row of rows) {
    if (!row.inStock) map[row.slug] = false;
  }
  return map;
}

export function isInStock(stockMap: Record<string, boolean>, slug: string) {
  return stockMap[slug] !== false;
}
