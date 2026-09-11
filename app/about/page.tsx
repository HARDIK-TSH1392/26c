export const metadata = {
  title: "About",
  description:
    "26c is a small graphic tee label — hand-drawn prints, oversized fits, printed in small batches. Run by NH Tech Private Limited.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink/80">
      <h1 className="text-2xl font-bold text-ink mb-6">About 26c</h1>

      <p className="mb-6">
        26c is a small graphic tee label built around hand-drawn prints and
        oversized fits. Every design starts as a sketch before it ever
        touches a shirt — no stock clipart, no filler prints.
      </p>
      <p className="mb-6">
        Everything is 100% cotton, printed in small batches, so a drop can
        sell out and stay sold out. If you see it in stock, it&apos;s really
        in stock.
      </p>
      <p className="mb-6">
        26c is run by{" "}
        <strong>NH Tech Private Limited</strong>, based in New Delhi, India.
      </p>

      <p className="text-ink/60">
        Questions, collabs, or just want to talk tees? Email us at{" "}
        <a href="mailto:hardik@nhtech.in" className="underline">
          hardik@nhtech.in
        </a>
        .
      </p>
    </main>
  );
}
