"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { products } from "@/data/products";
import { useGreenLeavesSale } from "@/lib/green-leaves-context";
import { useCurrency } from "@/lib/currency-context";
import { usdPrice, usdSalePrice } from "@/lib/currency";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export default function CheckoutPage() {
  const { lines, subtotal, clearCart, unitPrice } = useCart();
  const { data: session, status: sessionStatus } = useSession();
  const { active: saleActive } = useGreenLeavesSale();
  const { isIndia } = useCurrency();

  // The real, binding charge is always INR (Razorpay only processes INR
  // here) — this is only a "~$X" reference alongside it for a non-India
  // browser, not a currency swap of the actual amount being charged.
  const usdUnit = (inrPrice: number, inrMrp: number) =>
    saleActive ? usdSalePrice(inrPrice, inrMrp) : usdPrice(inrPrice);
  const usdSubtotal = lines.reduce((sum, l) => {
    const p = products.find((prod) => prod.slug === l.slug);
    if (!p) return sum;
    return sum + usdUnit(p.price, p.mrp) * l.qty;
  }, 0);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useManualForm, setUseManualForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    paymentId: string;
    orderId: string;
  } | null>(null);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((d) => {
        const addrs: SavedAddress[] = d.addresses ?? [];
        setSavedAddresses(addrs);
        const def = addrs.find((a) => a.isDefault) ?? addrs[0];
        if (def) setSelectedAddressId(def.id);
        else setUseManualForm(true);
      });
  }, [sessionStatus]);

  const updateField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const usingSavedAddress =
    sessionStatus === "authenticated" && !useManualForm && !!selectedAddressId;
  const formComplete = usingSavedAddress
    ? true
    : Object.values(form).every((v) => v.trim().length > 0);

  const handlePay = async () => {
    setError(null);
    if (!formComplete) {
      setError("Please fill in all shipping details before paying.");
      return;
    }
    if (!scriptReady || !window.Razorpay) {
      setError("Payment is still loading, try again in a second.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            slug: l.slug,
            size: l.size,
            qty: l.qty,
          })),
          ...(usingSavedAddress
            ? { addressId: selectedAddressId }
            : { customer: form }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not start payment");
      }

      const prefillName = usingSavedAddress
        ? savedAddresses.find((a) => a.id === selectedAddressId)?.fullName
        : form.name;
      const prefillPhone = usingSavedAddress
        ? savedAddresses.find((a) => a.id === selectedAddressId)?.phone
        : form.phone;

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "26c",
        description: "Graphic tees order",
        prefill: {
          name: prefillName,
          email: session?.user?.email ?? form.email,
          contact: prefillPhone,
        },
        theme: { color: "#141414" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.verified) {
              setSuccess({
                paymentId: verifyData.paymentId,
                orderId: verifyData.orderId,
              });
              clearCart();
            } else {
              setError(
                "Payment could not be verified. If money was deducted, contact us with your payment ID."
              );
            }
          } catch {
            setError(
              "Payment could not be verified. If money was deducted, contact us with your payment ID."
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">
          You are too sexy for shopping 😉
        </h1>
        <p className="text-sm text-ink/70 mb-1">Order confirmed!</p>
        <p className="text-sm text-ink/60 mb-1">
          Payment ID: <span className="font-mono">{success.paymentId}</span>
        </p>
        <p className="text-sm text-ink/60 mb-1">
          Estimated delivery: <strong>10-12 business days</strong>
        </p>
        <p className="text-sm text-ink/60 mb-8">
          We&apos;ve emailed your invoice — check your inbox.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/account/orders" className="text-sm underline">
            View My Orders
          </Link>
          <Link href="/" className="text-sm underline">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-xl font-bold mb-3">Your bag is empty</h1>
        <Link href="/" className="text-sm underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />

      <h1 className="text-2xl font-bold mb-1">Checkout</h1>
      <p className="text-sm text-ink/60 mb-8">
        Enter your shipping details and pay securely with Razorpay.
      </p>

      <div className="border border-line divide-y divide-line mb-8">
        {lines.map((line) => {
          const product = products.find((p) => p.slug === line.slug);
          if (!product) return null;
          return (
            <div key={`${line.slug}-${line.size}`} className="flex gap-4 p-4">
              <div className="relative w-16 h-20 shrink-0 bg-white border border-line">
                <Image
                  src={product.images.flatCard}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">{product.name}</p>
                <p className="text-ink/50">
                  {product.colorway} · Size {line.size} · Qty {line.qty}
                </p>
              </div>
              <div className="text-sm font-semibold text-right">
                ₹{unitPrice(line.slug) * line.qty}
                {!isIndia && product && (
                  <div className="text-xs text-ink/40 font-normal">
                    ~${usdUnit(product.price, product.mrp) * line.qty}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mb-2 text-base font-bold items-baseline">
        <span>Subtotal</span>
        <span>
          ₹{subtotal}
          {!isIndia && (
            <span className="text-xs text-ink/40 font-normal ml-1.5">
              (~${usdSubtotal})
            </span>
          )}
        </span>
      </div>
      <p className="text-xs text-ink/50 mb-8">
        Estimated delivery: 10-12 business days
      </p>

      <h2 className="text-sm font-bold uppercase tracking-wide mb-4">
        Shipping Details
      </h2>

      {sessionStatus === "authenticated" && !useManualForm ? (
        <div className="space-y-3 mb-3">
          {savedAddresses.length === 0 ? (
            <p className="text-sm text-ink/50">
              No saved addresses.{" "}
              <button
                onClick={() => setUseManualForm(true)}
                className="underline"
              >
                Enter one now
              </button>
              .
            </p>
          ) : (
            savedAddresses.map((a) => (
              <label
                key={a.id}
                className={`block border p-3 text-sm cursor-pointer ${
                  selectedAddressId === a.id ? "border-ink" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mr-2"
                  checked={selectedAddressId === a.id}
                  onChange={() => setSelectedAddressId(a.id)}
                />
                <span className="font-medium">{a.label}</span> — {a.fullName},{" "}
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state}{" "}
                {a.pincode} · {a.phone}
              </label>
            ))
          )}
          <button
            onClick={() => setUseManualForm(true)}
            className="text-xs underline text-ink/60"
          >
            Use a different address
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className="col-span-2 border border-line px-3 py-2.5 text-sm"
              placeholder="Full name"
              value={form.name}
              onChange={updateField("name")}
            />
            <input
              className="border border-line px-3 py-2.5 text-sm"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={updateField("email")}
            />
            <input
              className="border border-line px-3 py-2.5 text-sm"
              placeholder="Phone"
              type="tel"
              value={form.phone}
              onChange={updateField("phone")}
            />
            <input
              className="col-span-2 border border-line px-3 py-2.5 text-sm"
              placeholder="Address"
              value={form.address}
              onChange={updateField("address")}
            />
            <input
              className="border border-line px-3 py-2.5 text-sm"
              placeholder="City"
              value={form.city}
              onChange={updateField("city")}
            />
            <input
              className="border border-line px-3 py-2.5 text-sm"
              placeholder="State"
              value={form.state}
              onChange={updateField("state")}
            />
            <input
              className="border border-line px-3 py-2.5 text-sm"
              placeholder="Pincode"
              value={form.pincode}
              onChange={updateField("pincode")}
            />
          </div>
          {sessionStatus === "authenticated" && savedAddresses.length > 0 && (
            <button
              onClick={() => setUseManualForm(false)}
              className="text-xs underline text-ink/60 mb-3"
            >
              Use a saved address instead
            </button>
          )}
        </>
      )}

      {error && <p className="text-sm text-accent mb-3 mt-2">{error}</p>}

      <button
        onClick={handlePay}
        disabled={loading}
        className="block text-center w-full py-4 bg-ink text-paper text-sm font-bold uppercase tracking-wide hover:bg-accent transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? "Processing…" : `Pay ₹${subtotal} with Razorpay`}
      </button>
    </main>
  );
}
