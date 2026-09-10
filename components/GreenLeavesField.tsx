"use client";

import { useState } from "react";
import MushroomDoodle from "@/components/MushroomDoodle";
import LeafDoodle from "@/components/LeafDoodle";
import { seededRandom, stratifiedPoint } from "@/lib/seeded-random";

const TOP_MUSHROOM_COUNT = 9;
const BOTTOM_MUSHROOM_COUNT = 9;
const LEAF_COUNT = 12;

function smokePuffs(size: number, smokeDur: number, smokeDelay: number) {
  const smokeSize = size * 1.3;
  return [0, 1].map((puff) => (
    <div
      key={puff}
      className="absolute rounded-full"
      style={{
        left: "50%",
        bottom: "65%",
        width: smokeSize,
        height: smokeSize,
        marginLeft: -(smokeSize / 2),
        background:
          "radial-gradient(circle, rgba(235,235,235,0.85) 0%, rgba(200,200,200,0.35) 55%, transparent 78%)",
        filter: "blur(3px)",
        animation: `gl-smoke ${smokeDur}s ease-out ${
          smokeDelay + puff * (smokeDur / 2)
        }s infinite`,
      }}
      suppressHydrationWarning
    />
  ));
}

function WindLeaf({ seed, x, y, size }: { seed: number; x: number; y: number; size: number }) {
  const [burning, setBurning] = useState(false);

  const rot = seededRandom(seed * 9.1) * 40 - 20;
  // wide, uneven range so gusts feel random rather than metronomic
  const gustDur = 4 + seededRandom(seed * 13.7) * 7;
  const gustDelay = seededRandom(seed * 15.1) * 6;
  const neonDur = 3 + seededRandom(seed * 17.9) * 5;
  const neonDelay = seededRandom(seed * 19.3) * 5;
  const smokeDur = 3.5 + seededRandom(seed * 20.6) * 3;
  const smokeDelay = seededRandom(seed * 22.8) * 2;

  const ignite = () => setBurning(true);

  return (
    <div
      className="absolute pointer-events-auto cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      onClick={ignite}
      role="button"
      tabIndex={0}
      aria-label="Leaf — click to light it"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") ignite();
      }}
    >
      {burning && smokePuffs(size, smokeDur, smokeDelay)}
      <LeafDoodle
        className="absolute inset-0 opacity-80"
        style={{
          ["--rot" as string]: `${rot}deg`,
          animation: burning
            ? "gl-burn-drift 2.6s ease-in-out infinite, gl-catch-fire 4.5s ease-in forwards"
            : `gl-gust ${gustDur}s ease-in-out ${gustDelay}s infinite, gl-neon ${neonDur}s linear ${neonDelay}s infinite`,
        }}
      />
    </div>
  );
}

export default function GreenLeavesField() {
  return (
    <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
      {Array.from({ length: TOP_MUSHROOM_COUNT }).map((_, i) => {
        const { cx, cy } = stratifiedPoint(i, 3, 3, 10);
        const x = cx * 92 + 2;
        const y = cy * 32 + 1;
        const size = 30 + seededRandom(i * 7.3) * 20;
        const rot = seededRandom(i * 9.1) * 60 - 30;
        const drift = 10 + seededRandom(i * 11.3) * 16;
        const windDur = 2.5 + seededRandom(i * 13.7) * 8;
        const windDelay = seededRandom(i * 15.1) * 5;
        return (
          <MushroomDoodle
            key={`top-${i}`}
            seed={i + 1}
            palette="trippy"
            className="absolute opacity-80"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              ["--rot" as string]: `${rot}deg`,
              ["--drift" as string]: `${drift}px`,
              animation: `gl-wind ${windDur}s ease-in-out ${windDelay}s infinite`,
            }}
          />
        );
      })}

      {Array.from({ length: LEAF_COUNT }).map((_, i) => {
        const seed = i + 500;
        const { cx, cy } = stratifiedPoint(i, 4, 3, 520);
        const x = cx * 90 + 2;
        const y = cy * 56 + 4;
        const size = 26 + seededRandom(seed * 8.1) * 16;
        return <WindLeaf key={`leaf-${i}`} seed={seed} x={x} y={y} size={size} />;
      })}

      {Array.from({ length: BOTTOM_MUSHROOM_COUNT }).map((_, i) => {
        const { cx, cy } = stratifiedPoint(i, 3, 3, 1010);
        const x = cx * 92 + 2;
        const y = 55 + cy * 35;
        const size = 32 + seededRandom(i * 8.8 + 100) * 20;
        const rot = seededRandom(i * 10.2 + 100) * 50 - 25;
        const burnDur = 1 + seededRandom(i * 12.6 + 100) * 6;
        const burnDelay = seededRandom(i * 14.8 + 100) * 4;
        const smokeDur = 3.5 + seededRandom(i * 20.6 + 100) * 4;
        const smokeDelay = seededRandom(i * 22.8 + 100) * 3;
        return (
          <div
            key={`bottom-${i}`}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
          >
            {smokePuffs(size, smokeDur, smokeDelay)}
            <div
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                width: size * 1.6,
                height: size * 1.6,
                marginLeft: -(size * 0.8),
                marginTop: -(size * 0.8),
                background:
                  "radial-gradient(circle, rgba(255,90,0,0.55) 0%, rgba(255,30,0,0.25) 45%, transparent 72%)",
                filter: "blur(3px)",
                animation: `gl-ember-glow ${burnDur * 1.4}s ease-in-out ${burnDelay}s infinite`,
              }}
              suppressHydrationWarning
            />
            <MushroomDoodle
              seed={i + 200}
              palette="fire"
              className="absolute inset-0"
              style={{
                ["--rot" as string]: `${rot}deg`,
                animation: `gl-burn-drift ${burnDur}s ease-in-out ${burnDelay}s infinite`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
