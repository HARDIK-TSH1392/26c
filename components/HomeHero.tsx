"use client";

import HeroCarousel from "@/components/HeroCarousel";
import MushroomDoodle from "@/components/MushroomDoodle";
import GreenLeavesField from "@/components/GreenLeavesField";
import { useGreenLeavesSale } from "@/lib/green-leaves-context";
import { SALE_DISCOUNT_PERCENT } from "@/lib/green-leaves-sale";

export default function HomeHero() {
  const { active, secondsRemaining } = useGreenLeavesSale();

  if (active) {
    return (
      <section className="relative bg-gradient-to-br from-green-950 via-green-800 to-green-950 text-paper overflow-hidden">
        <GreenLeavesField />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 text-center">
          <p className="uppercase tracking-[0.4em] text-xs text-green-200 mb-4 animate-pulse">
            You found it
          </p>
          <h1 className="text-4xl md:text-7xl font-black leading-[0.95] flex items-center justify-center gap-4">
            <MushroomDoodle seed={3} className="w-10 h-10 md:w-14 md:h-14 shrink-0 -rotate-6" />
            Green Leaves Sale
            <MushroomDoodle seed={4} className="w-10 h-10 md:w-14 md:h-14 shrink-0 rotate-6" />
          </h1>
          <p className="mt-6 text-2xl md:text-3xl font-bold text-green-200">
            {SALE_DISCOUNT_PERCENT}% off everything
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-paper/60">
            5-minute countdown
          </p>
          <p className="mt-1 text-5xl font-mono font-black tabular-nums">
            {Math.floor(secondsRemaining / 60)}:
            {String(secondsRemaining % 60).padStart(2, "0")}
          </p>
          <p className="mt-2 text-sm text-paper/70">
            Blink and it&apos;s gone.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-ink text-paper overflow-hidden">
      <HeroCarousel />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
        <p className="uppercase tracking-[0.3em] text-xs text-paper/60 mb-4">
          26c Graphic Tees
        </p>
        <h1 className="text-4xl md:text-6xl font-black leading-[0.95] max-w-2xl">
          Hand-drawn prints.
          <br />
          Oversized fits.
        </h1>
        <p className="mt-5 max-w-md text-paper/70 text-sm md:text-base">
          100% cotton, small-batch printed tees. Six drops, live now.
        </p>
      </div>
    </section>
  );
}
