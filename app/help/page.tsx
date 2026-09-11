import Link from "next/link";

export const metadata = {
  title: "Help",
  description: "Size guide, order tracking, delivery times, and how to reach 26c.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink/80">
      <h1 className="text-2xl font-bold text-ink mb-6">Help</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-base font-bold text-ink mb-1">
            <Link href="/size-guide" className="underline">
              Size Guide
            </Link>
          </h2>
          <p className="text-ink/60">
            Not sure which size to pick? Check our chest and length
            measurements.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-ink mb-1">
            <Link href="/account/orders" className="underline">
              Track an order
            </Link>
          </h2>
          <p className="text-ink/60">
            View your order status and history from your account.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-ink mb-1">Delivery</h2>
          <p className="text-ink/60">
            Estimated delivery is 10-12 business days across India.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-ink mb-1">
            Still need help?
          </h2>
          <p className="text-ink/60">
            Email us at{" "}
            <a href="mailto:hardik@nhtech.in" className="underline">
              hardik@nhtech.in
            </a>{" "}
            and we&apos;ll get back to you.
          </p>
        </div>
      </div>
    </main>
  );
}
