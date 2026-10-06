"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { products } from "@/data/products";

// Newest launches lead the rotation (and get the eager-loaded first slot)
// rather than sitting wherever they fall in catalog order.
const SLIDES = [...products]
  .sort((a, b) => {
    const aFirst = a.category === "Sunglasses";
    const bFirst = b.category === "Sunglasses";
    return aFirst === bFirst ? 0 : aFirst ? -1 : 1;
  })
  .map((p) => ({
    src: p.images.front,
    alt: `${p.name} — ${p.colorway}`,
    position: "object-[center_34%]",
  }));

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const goTo = (i: number) => setActive((i + SLIDES.length) % SLIDES.length);

  return (
    <>
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover ${slide.position} transition-opacity duration-[1200ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <button
        aria-label="Previous slide"
        onClick={() => goTo(active - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-ink/30 hover:bg-ink/50 text-paper transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        aria-label="Next slide"
        onClick={() => goTo(active + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-ink/30 hover:bg-ink/50 text-paper transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute bottom-5 left-6 z-10 flex gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1 rounded-full transition-all ${
              i === active ? "w-6 bg-paper" : "w-1.5 bg-paper/40"
            }`}
          />
        ))}
      </div>
    </>
  );
}
