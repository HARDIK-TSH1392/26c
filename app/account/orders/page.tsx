"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

type OrderItem = {
  id: string;
  productName: string;
  colorway: string;
  size: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  createdAt: string;
  subtotal: number;
  status: string;
  items: OrderItem[];
  invoice: { invoiceNumber: string } | null;
};

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading") return null;

  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-xl font-bold mb-4">Sign in to see your orders</h1>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-3 bg-ink text-paper text-sm font-bold uppercase tracking-wide"
        >
          Sign in with Google
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {loading && <p className="text-sm text-ink/50">Loading…</p>}

      {!loading && orders.length === 0 && (
        <p className="text-sm text-ink/50">
          No orders yet — once you check out, they&apos;ll show up here.
        </p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-line p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold">
                  Order {order.id.slice(0, 10)}
                </p>
                <p className="text-xs text-ink/50">
                  {new Date(order.createdAt).toLocaleDateString()} · Estimated
                  delivery 10-12 business days
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₹{order.subtotal}</p>
                {order.invoice && (
                  <a
                    href={`/api/invoices/${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline"
                  >
                    View Invoice
                  </a>
                )}
              </div>
            </div>
            <div className="divide-y divide-line text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="py-2 flex justify-between">
                  <span>
                    {item.productName} — {item.colorway} · Size {item.size} ×{" "}
                    {item.qty}
                  </span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
