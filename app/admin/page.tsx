"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  avgOrderValue: number;
  statusCounts: Record<string, number>;
  recentOrders: {
    id: string;
    createdAt: string;
    subtotal: number;
    status: string;
    items: { productName: string; qty: number }[];
  }[];
};

const STATUS_LABEL: Record<string, string> = {
  paid: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-accent text-white",
  processing: "bg-amber-500 text-white",
  shipped: "bg-blue-600 text-white",
  delivered: "bg-green-700 text-white",
  cancelled: "bg-ink/30 text-white",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p className="text-sm text-ink/50">Loading…</p>;

  const tiles = [
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}` },
    { label: "Orders Today", value: stats.ordersToday },
    { label: "Avg Order Value", value: `₹${stats.avgOrderValue}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {tiles.map((t) => (
          <div key={t.label} className="border border-line p-5">
            <p className="text-xs uppercase tracking-wide text-ink/50 mb-2">
              {t.label}
            </p>
            <p className="text-2xl font-bold">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/orders?status=${key}`}
            className="border border-line p-4 hover:border-ink transition-colors"
          >
            <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">
              {label}
            </p>
            <p className="text-xl font-bold">{stats.statusCounts[key] ?? 0}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wide">
          Recent Orders
        </h2>
        <Link href="/admin/orders" className="text-xs underline">
          View all
        </Link>
      </div>

      <div className="border border-line divide-y divide-line">
        {stats.recentOrders.length === 0 && (
          <p className="p-4 text-sm text-ink/50">No orders yet.</p>
        )}
        {stats.recentOrders.map((o) => (
          <Link
            key={o.id}
            href={`/admin/orders/${o.id}`}
            className="flex items-center justify-between p-4 text-sm hover:bg-line/30"
          >
            <div>
              <p className="font-medium">{o.id.slice(0, 12)}</p>
              <p className="text-ink/50 text-xs">
                {new Date(o.createdAt).toLocaleString()} ·{" "}
                {o.items.reduce((n, i) => n + i.qty, 0)} item(s)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">₹{o.subtotal}</span>
              <span
                className={`text-[10px] uppercase px-2 py-1 ${
                  STATUS_COLOR[o.status] ?? "bg-ink/20"
                }`}
              >
                {STATUS_LABEL[o.status] ?? o.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
