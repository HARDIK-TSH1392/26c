import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// "created" = checkout started but never paid (Order rows are inserted the
// moment someone clicks Pay, before Razorpay confirms anything), "failed" =
// payment attempted and declined. Neither is a real order.
const COMPLETED_STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled"];

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      isWhatsApp: true,
      onboarded: true,
      createdAt: true,
      _count: {
        select: { orders: { where: { status: { in: COMPLETED_STATUSES } } } },
      },
    },
  });

  return NextResponse.json({ users });
}
