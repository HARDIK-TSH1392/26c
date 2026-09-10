"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

type OrderDetail = {
  id: string;
  createdAt: string;
  subtotal: number;
  status: string;
  razorpayPaymentId: string | null;
  shippingSnapshot: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  user: { name: string | null; email: string | null } | null;
  items: {
    id: string;
    productName: string;
    colorway: string;
    size: string;
    qty: number;
    price: number;
  }[];
  invoice: { invoiceNumber: string; emailSentAt: string | null } | null;
};

const STATUS_FLOW = ["paid", "processing", "shipped", "delivered"];

export default function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order));
  };

  useEffect(load, [id]);

  if (!order) return <p className="text-sm text-ink/50">Loading…</p>;

  const shipTo = JSON.parse(order.shippingSnapshot) as {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
    setUpdating(false);
  };

  return (
    <div>
      <Link href="/admin/orders" className="text-xs underline mb-4 inline-block">
        ← Back to Orders
      </Link>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Order {order.id.slice(0, 12)}</h1>
          <p className="text-sm text-ink/50">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">₹{order.subtotal}</p>
          {order.invoice && (
            <a
              href={`/api/invoices/${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
            >
              {order.invoice.invoiceNumber}
              {order.invoice.emailSentAt ? " (emailed)" : " (not emailed)"}
            </a>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="border border-line p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-3">
            Customer
          </h2>
          <p className="text-sm">{order.user?.name ?? order.guestName ?? shipTo.name}</p>
          <p className="text-sm text-ink/60">
            {order.user?.email ?? order.guestEmail ?? shipTo.email}
          </p>
          <p className="text-sm text-ink/60">{order.guestPhone ?? shipTo.phone}</p>
          {order.razorpayPaymentId && (
            <p className="text-xs text-ink/40 mt-3 font-mono">
              {order.razorpayPaymentId}
            </p>
          )}
        </div>

        <div className="border border-line p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-3">
            Shipping Address
          </h2>
          <p className="text-sm">{shipTo.address}</p>
          <p className="text-sm">
            {shipTo.city}, {shipTo.state} {shipTo.pincode}
          </p>
          <p className="text-sm text-ink/60 mt-1">{shipTo.phone}</p>
        </div>
      </div>

      <div className="border border-line divide-y divide-line mb-8">
        {order.items.map((item) => (
          <div key={item.id} className="p-4 flex justify-between text-sm">
            <span>
              {item.productName} — {item.colorway} · Size {item.size} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="border border-line p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-4">
          Order Status
        </h2>

        {order.status === "cancelled" ? (
          <p className="text-sm text-accent">This order is cancelled.</p>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FLOW.map((s) => {
              const currentIdx = STATUS_FLOW.indexOf(order.status);
              const thisIdx = STATUS_FLOW.indexOf(s);
              const isCurrent = order.status === s;
              const isPast = thisIdx < currentIdx;
              return (
                <button
                  key={s}
                  disabled={updating || isCurrent}
                  onClick={() => updateStatus(s)}
                  className={`px-4 py-2 text-xs uppercase tracking-wide border ${
                    isCurrent
                      ? "bg-ink text-paper border-ink"
                      : isPast
                      ? "border-line text-ink/30 line-through"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}

        {order.status !== "cancelled" && (
          <button
            disabled={updating}
            onClick={() => updateStatus("cancelled")}
            className="mt-4 text-xs underline text-accent"
          >
            Cancel this order
          </button>
        )}
      </div>
    </div>
  );
}
