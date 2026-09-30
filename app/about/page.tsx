export const metadata = {
  title: "About",
  description:
    "26C started during a sesh between three friends. Trippy, clean, comfortable T-shirts — designs you'll actually want to wear again and again.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink/80">
      <h1 className="text-2xl font-bold text-ink mb-6">
        It started with three friends.
      </h1>

      <p className="mb-6">
        26C started during a sesh between three friends, when our designer
        picked up a few T-shirts and started drawing.
      </p>
      <p className="mb-6">
        What began as something we made for ourselves slowly became more
        than just T-shirts. They became a ritual — something we wore,
        shared, and came back to.
      </p>
      <p className="mb-6">That&apos;s what 26C is about.</p>

      <p className="mb-6">
        <strong className="text-ink">Trippy. Clean. Comfortable.</strong>
        <br />
        Made to stand out without trying too hard.
      </p>

      <p className="mb-6">
        We&apos;re here to make damn good T-shirts at a price that makes
        sense — with designs you&apos;ll actually want to wear again and
        again.
      </p>

      <p className="mb-6">
        <strong className="text-ink">
          Buy one. Make it yours. Make it a ritual.
        </strong>
      </p>

      <p className="text-lg font-bold text-ink mb-10">
        26C — it&apos;s way too sexy. 😮‍💨
      </p>

      <p className="text-xs text-ink/50 mb-6">
        26c is run by NH Tech Private Limited, based in New Delhi, India.
      </p>

      <p className="text-ink/60">
        Questions, collabs, or just want to talk tees? Email us at{" "}
        <a href="mailto:26c@nhtech.in" className="underline">
          26c@nhtech.in
        </a>
        .
      </p>
    </main>
  );
}
