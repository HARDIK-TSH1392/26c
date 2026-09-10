import { seededRandom } from "@/lib/seeded-random";

// A cute hand-drawn mushroom. Cap outline, each spot, and the stem outline
// all glow on their own independent, randomized color cycle — some fast,
// some slow — so no two parts (and no two mushrooms) are ever in sync.
export default function MushroomDoodle({
  className = "",
  style,
  seed = 0,
  palette = "trippy",
}: {
  className?: string;
  style?: React.CSSProperties;
  seed?: number;
  palette?: "trippy" | "fire";
}) {
  // "-solid" variants animate color only, no drop-shadow — a glow filter on
  // a shape this small gets hard-clipped at its filter region edge, which
  // shows up as a visible square box around the part. See globals.css.
  const anim = palette === "fire" ? "gl-neon-burn-solid" : "gl-neon-solid";

  const glow = (offset: number, durRange: [number, number] = [2.5, 8.5]) => {
    const dur = durRange[0] + seededRandom(seed * 7.13 + offset) * (durRange[1] - durRange[0]);
    const delay = seededRandom(seed * 11.37 + offset + 50) * 5;
    return { animation: `${anim} ${dur}s linear ${delay}s infinite` };
  };

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
      suppressHydrationWarning
    >
      {/* cap */}
      <path
        d="M8 23C8 12 15 5 24 5s16 7 16 18c0 1.5-1.5 2.5-3.5 2.5h-25C9.5 25.5 8 24.5 8 23Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={glow(1, [3, 8])}
        suppressHydrationWarning
      />
      {/* spots — each its own independent glow */}
      <circle cx="16.5" cy="15" r="2.1" fill="currentColor" style={glow(2)} suppressHydrationWarning />
      <circle cx="27" cy="10.5" r="2.6" fill="currentColor" style={glow(3)} suppressHydrationWarning />
      <circle cx="33" cy="18" r="1.7" fill="currentColor" style={glow(4)} suppressHydrationWarning />
      <circle cx="21" cy="20.5" r="1.3" fill="currentColor" style={glow(5)} suppressHydrationWarning />
      {/* stem */}
      <path
        d="M16 25.5c-1 6-1 11.5 1 15 1.2 2 13.6 2 14.8 0 2-3.5 2-9 1-15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={glow(6, [3, 8])}
        suppressHydrationWarning
      />
      {/* cute static face — stays put so the mushroom keeps character while it glows */}
      <circle cx="19.5" cy="31" r="1.15" fill="#052e1a" />
      <circle cx="27.5" cy="31" r="1.15" fill="#052e1a" />
      <path
        d="M20 34c2 1.6 4.8 1.6 6.8 0"
        stroke="#052e1a"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
