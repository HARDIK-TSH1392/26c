import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";

export async function GET() {
  const statuses = await prisma.productStatus.findMany();
  const statusMap = new Map(statuses.map((s) => [s.slug, s.inStock]));

  const inventory = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    colorway: p.colorway,
    price: p.price,
    image: p.images.flatCard,
    inStock: statusMap.has(p.slug) ? statusMap.get(p.slug)! : true,
  }));

  return NextResponse.json({ inventory });
}
