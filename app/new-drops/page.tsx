import { upcomingDesigns } from "@/data/upcoming";
import ComingSoonCard from "@/components/ComingSoonCard";

export default function NewDropsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <p className="uppercase tracking-[0.3em] text-xs text-ink/50 mb-3">
        In Development
      </p>
      <h1 className="text-3xl md:text-4xl font-black mb-3">New Drops</h1>
      <p className="text-sm text-ink/60 max-w-xl mb-10">
        Design concepts we&apos;re deciding between for the next drop. Not in
        production yet, so these aren&apos;t purchasable — tap a swatch to
        preview colorways.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {upcomingDesigns.map((design) => (
          <ComingSoonCard key={design.id} design={design} />
        ))}
      </div>
    </main>
  );
}
