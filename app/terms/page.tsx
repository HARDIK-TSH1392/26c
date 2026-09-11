export const metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink/80">
      <h1 className="text-2xl font-bold text-ink mb-2">Terms of Service</h1>
      <p className="text-xs text-ink/50 mb-8">Last updated: September 2026</p>

      <p className="mb-6">
        These terms govern your use of <strong>26c.in</strong>, operated by
        NH Tech Private Limited. By placing an order with us, you agree to
        these terms.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">Orders & Pricing</h2>
      <p className="mb-6">
        All prices are listed in Indian Rupees (₹) and are inclusive of
        applicable taxes unless stated otherwise. We reserve the right to
        correct pricing errors and to cancel orders placed at an incorrect
        price, with a full refund.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">Payments</h2>
      <p className="mb-6">
        Payments are processed securely via Razorpay. We do not store your
        card or banking details.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Shipping & Delivery
      </h2>
      <p className="mb-6">
        Estimated delivery time is 10-12 business days from the date of
        order confirmation. Delivery times may vary based on your location
        and courier availability.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Returns & Exchanges
      </h2>
      <p className="mb-6">
        If you receive a damaged or incorrect item, contact us within 7 days
        of delivery at{" "}
        <a href="mailto:26c@nhtech.in" className="underline">
          26c@nhtech.in
        </a>{" "}
        with your order ID and photos of the issue, and we'll arrange a
        replacement or refund.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Account & Sign-In
      </h2>
      <p className="mb-6">
        You may sign in using your Google account to save addresses and view
        order history. You're responsible for keeping your account secure.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Limitation of Liability
      </h2>
      <p className="mb-6">
        26c and NH Tech Private Limited are not liable for indirect or
        incidental damages arising from use of this site or delays in
        delivery caused by circumstances outside our reasonable control.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Governing Law
      </h2>
      <p className="mb-6">
        These terms are governed by the laws of India. Any disputes will be
        subject to the jurisdiction of the courts in New Delhi.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">Contact</h2>
      <p className="mb-6">
        Questions? Email{" "}
        <a href="mailto:26c@nhtech.in" className="underline">
          26c@nhtech.in
        </a>
        .
      </p>
    </main>
  );
}
