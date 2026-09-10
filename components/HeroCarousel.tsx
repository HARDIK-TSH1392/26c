"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { products } from "@/data/products";

const SLIDES = [
  ...products.map((p) => ({
    src: p.images.front,
    alt: `${p.name} — ${p.colorway}`,
    position: "object-[center_34%]",
  })),
  {
    src: "/hero/vice-teaser.webp",
    alt: "Vice by 26c — coming soon",
    position: "object-center",
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

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
