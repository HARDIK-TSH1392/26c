"use client";

import Image from "next/image";
import { useState } from "react";
import type { UpcomingDesign } from "@/data/upcoming";

export default function ComingSoonCard({
  design,
}: {
  design: UpcomingDesign;
}) {
  const [active, setActive] = useState(0);
  const colorway = design.colorways[active];

  return (
    <div>
      <div className="relative aspect-[3/4] bg-white border border-line overflow-hidden">
        <span className="absolute top-2 left-2 z-10 bg-accent text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1">
          Coming Soon
        </span>
        <Image
          src={colorway.image}
          alt={`${design.name} — ${colorway.name}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="mt-3 space-y-1.5">
        <h3 className="text-sm font-medium leading-snug">{design.name}</h3>
        <p className="text-xs text-ink/50">{colorway.name}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {design.colorways.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActive(i)}
              aria-label={c.name}
              title={c.name}
              className={`w-5 h-5 rounded-full border transition-shadow ${
                active === i
                  ? "ring-2 ring-offset-1 ring-ink"
                  : "border-line"
              }`}
              style={{ backgroundColor: SWATCH_COLORS[c.name] ?? "#ccc" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const SWATCH_COLORS: Record<string, string> = {
  "Vintage White": "#efe9e1",
  "Stone Grey": "#a8a49c",
  "Sage Green": "#8b9a83",
  "Dusty Blue": "#7a93ab",
  "Faded Black": "#2b2b2b",
  "Butter Yellow": "#f0dd8f",
  Lavender: "#c9bce0",
  Seafoam: "#a9c9b6",
  "Sky Blue": "#a9c6e0",
  Coral: "#e58b74",
  "Washed Charcoal": "#4a4a48",
  "Olive Green": "#6b6b45",
  "Deep Plum": "#5a2f45",
  "Jet Black": "#161616",
  "Astro Black": "#0d0d10",
  "Moon Grey": "#8f8f8f",
  "Cosmic Navy": "#1c2540",
  "Nebula Purple": "#463356",
  "Planet Sand": "#a8916f",
  Sand: "#d8cdb8",
  Sage: "#8c9a80",
  Terracotta: "#bd6b4d",
  Charcoal: "#3a3a3a",
  "Acid Wash": "#4b4b4b",
  "Neon Dream": "#141414",
  "Cosmic Swirl": "#161629",
  "Melting Mind": "#e7ddcb",
  "Psychedelic Pastel": "#dcc9dd",
  "Vintage Black": "#232323",
  "Faded Navy": "#28344a",
  "Off White": "#efeae2",
  "Forest Green": "#2e3f31",
  "Washed Maroon": "#5c2f36",
};
