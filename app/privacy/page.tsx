export const metadata = {
  title: "Privacy Policy — 26c",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink/80">
      <h1 className="text-2xl font-bold text-ink mb-2">Privacy Policy</h1>
      <p className="text-xs text-ink/50 mb-8">Last updated: September 2026</p>

      <p className="mb-6">
        26c ("we", "us", "our") is operated by NH Tech Private Limited. This
        policy explains what information we collect when you use{" "}
        <strong>26c.in</strong>, and how we use it.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Information we collect
      </h2>
      <ul className="list-disc pl-5 space-y-1 mb-6">
        <li>
          <strong>Account information</strong>: if you sign in with Google,
          we receive your name, email address, and profile photo. We may also
          ask for your date of birth — this is optional and only used for
          things like birthday offers.
        </li>
        <li>
          <strong>Contact and shipping details</strong>: phone number and
          delivery address, provided by you at checkout or in your account.
        </li>
        <li>
          <strong>Order information</strong>: items purchased, order value,
          and payment status.
        </li>
        <li>
          <strong>Payment information</strong>: payments are processed by
          Razorpay. We do not store your card, UPI, or bank details on our
          servers — Razorpay handles that directly.
        </li>
      </ul>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        How we use your information
      </h2>
      <ul className="list-disc pl-5 space-y-1 mb-6">
        <li>To process and deliver your orders.</li>
        <li>To send order confirmations, invoices, and shipping updates.</li>
        <li>To let you view your past orders and manage saved addresses.</li>
        <li>To respond to support requests.</li>
      </ul>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Data sharing
      </h2>
      <p className="mb-6">
        We share order and shipping details with our courier partners solely
        to deliver your order, and payment details with Razorpay solely to
        process payment. We do not sell your personal information to third
        parties.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">
        Your rights
      </h2>
      <p className="mb-6">
        You can view and update your saved addresses and profile details
        anytime from your account page. To request deletion of your account
        or data, contact us using the details below.
      </p>

      <h2 className="text-base font-bold text-ink mt-8 mb-2">Contact</h2>
      <p className="mb-6">
        Questions about this policy? Email us at{" "}
        <a href="mailto:26c@nhtech.in" className="underline">
          26c@nhtech.in
        </a>
        .
      </p>
    </main>
  );
}
