import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { inStock } = await req.json();

  if (!products.some((p) => p.slug === slug)) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }
  if (typeof inStock !== "boolean") {
    return NextResponse.json({ error: "inStock must be boolean" }, { status: 400 });
  }

  const status = await prisma.productStatus.upsert({
    where: { slug },
    update: { inStock },
    create: { slug, inStock },
  });

  return NextResponse.json({ status });
}
