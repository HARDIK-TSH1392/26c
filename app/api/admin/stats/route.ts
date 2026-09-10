import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const REAL_STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled"];
const REVENUE_STATUSES = ["paid", "processing", "shipped", "delivered"];

export async function GET() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalOrders, revenueAgg, ordersToday, statusGroups, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { status: { in: REAL_STATUSES } } }),
      prisma.order.aggregate({
        where: { status: { in: REVENUE_STATUSES } },
        _sum: { subtotal: true },
      }),
      prisma.order.count({
        where: {
          status: { in: REAL_STATUSES },
          createdAt: { gte: startOfToday },
        },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: { status: { in: REAL_STATUSES } },
        _count: { _all: true },
      }),
      prisma.order.findMany({
        where: { status: { in: REAL_STATUSES } },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { items: true },
      }),
    ]);

  const statusCounts = Object.fromEntries(
    REAL_STATUSES.map((s) => [
      s,
      statusGroups.find((g) => g.status === s)?._count._all ?? 0,
    ])
  );

  const totalRevenue = revenueAgg._sum.subtotal ?? 0;

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    ordersToday,
    avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    statusCounts,
    recentOrders,
  });
}
