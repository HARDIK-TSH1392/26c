import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const REAL_STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where =
    status && status !== "all"
      ? { status }
      : { status: { in: REAL_STATUSES } };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true, user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ orders });
}
