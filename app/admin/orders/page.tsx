"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type Order = {
  id: string;
  createdAt: string;
  subtotal: number;
  status: string;
  guestName: string | null;
  user: { name: string | null; email: string | null } | null;
  items: { productName: string; colorway: string; size: string; qty: number }[];
};

const TABS = [
  { key: "all", label: "All" },
  { key: "paid", label: "New" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-accent text-white",
  processing: "bg-amber-500 text-white",
  shipped: "bg-blue-600 text-white",
  delivered: "bg-green-700 text-white",
  cancelled: "bg-ink/30 text-white",
};

function OrdersList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status") ?? "all";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${status}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => router.push(`/admin/orders?status=${t.key}`)}
            className={`text-xs uppercase tracking-wide px-3 py-1.5 border ${
              status === t.key
                ? "bg-ink text-paper border-ink"
                : "border-line text-ink/60 hover:border-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-ink/50">Loading…</p>}

      {!loading && orders.length === 0 && (
        <p className="text-sm text-ink/50">No orders in this view.</p>
      )}

      <div className="border border-line divide-y divide-line">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/admin/orders/${o.id}`}
            className="flex items-center justify-between p-4 text-sm hover:bg-line/30"
          >
            <div>
              <p className="font-medium">{o.id.slice(0, 12)}</p>
              <p className="text-ink/50 text-xs">
                {o.user?.name ?? o.guestName ?? "Guest"} ·{" "}
                {new Date(o.createdAt).toLocaleDateString()}
              </p>
              <p className="text-ink/40 text-xs">
                {o.items.map((i) => `${i.productName} (${i.colorway}, ${i.size}) x${i.qty}`).join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <span className="font-semibold">₹{o.subtotal}</span>
              <span
                className={`text-[10px] uppercase px-2 py-1 ${
                  STATUS_COLOR[o.status] ?? "bg-ink/20"
                }`}
              >
                {o.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink/50">Loading…</p>}>
      <OrdersList />
    </Suspense>
  );
}
