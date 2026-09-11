import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-sm text-ink/60 mb-8">
        That page doesn&apos;t exist, or the drop&apos;s been retired.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-ink text-paper text-sm font-bold uppercase tracking-wide hover:bg-accent transition-colors"
      >
        Back to Shop
      </Link>
    </main>
  );
}
