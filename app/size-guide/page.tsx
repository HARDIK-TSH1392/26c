export const metadata = {
  title: "Size Guide — 26c",
};

const SIZES = [
  { size: "S", chest: "38", length: "27" },
  { size: "M", chest: "40", length: "28" },
  { size: "L", chest: "42", length: "29" },
  { size: "XL", chest: "44", length: "30" },
  { size: "XXL", chest: "46", length: "31" },
];

export default function SizeGuidePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-ink/80">
      <h1 className="text-2xl font-bold text-ink mb-2">Size Guide</h1>
      <p className="text-ink/60 mb-8">
        All 26c tees are an oversized fit — if you&apos;re between sizes, size
        down for a regular fit.
      </p>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-line/30">
              <th className="px-4 py-3 font-bold">Size</th>
              <th className="px-4 py-3 font-bold">Chest (in)</th>
              <th className="px-4 py-3 font-bold">Length (in)</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((row) => (
              <tr key={row.size} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{row.size}</td>
                <td className="px-4 py-3">{row.chest}</td>
                <td className="px-4 py-3">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-base font-bold text-ink mt-10 mb-2">How to measure</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Chest</strong>: lay a well-fitting tee flat and measure
          straight across, one inch below the armhole, then double it.
        </li>
        <li>
          <strong>Length</strong>: measure from the highest point of the
          shoulder seam straight down to the hem.
        </li>
      </ul>

      <p className="mt-8 text-ink/60">
        Still unsure? Email us at{" "}
        <a href="mailto:hardik@nhtech.in" className="underline">
          hardik@nhtech.in
        </a>{" "}
        and we&apos;ll help you pick a size.
      </p>
    </main>
  );
}
