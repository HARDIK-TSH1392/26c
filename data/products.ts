export type Product = {
  id: string;
  slug: string;
  name: string;
  colorway: string;
  price: number;
  mrp: number;
  category: string;
  printType: "Solid Print" | "Multi-Color Print" | "Acid Wash Print";
  fit: string;
  fabric: string;
  sizes: string[];
  description: string;
  badge?: string;
  images: {
    flat: string;
    closeup: string;
    front: string;
    back: string;
    flatCard: string;
    frontCard: string;
  };
};

const GCS_BASE = "https://storage.googleapis.com/nh-26c-ecommerce-products/web/products";

const img = (slug: string) => ({
  flat: `${GCS_BASE}/${slug}/flat.webp`,
  closeup: `${GCS_BASE}/${slug}/closeup.webp`,
  front: `${GCS_BASE}/${slug}/front.webp`,
  back: `${GCS_BASE}/${slug}/back.webp`,
  flatCard: `${GCS_BASE}/${slug}/flat-card.webp`,
  frontCard: `${GCS_BASE}/${slug}/front-card.webp`,
});

// Products are ordered in two blocks: neutral colorways (sand/white/black/grey/acid
// wash) first, then colored colorways (green/blue/multi-color) — within each block,
// grouped by design family. Keep new additions in the matching block, not just appended.
export const products: Product[] = [
  // ---------- Neutrals ----------
  {
    id: "26c-001",
    slug: "hotbox-face-sand",
    name: "Hotbox Face Tee",
    colorway: "Sand",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A hand-drawn hotbox face graphic printed clean on soft sand cotton. Dropped shoulders, boxy body, everyday oversized fit.",
    badge: "Bestseller",
    images: img("hotbox-face-sand"),
  },
  {
    id: "26c-002",
    slug: "hotbox-face-black",
    name: "Hotbox Face Tee",
    colorway: "Black",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The hotbox face graphic in a clean white print on jet black cotton. Dropped shoulders, boxy body, everyday oversized fit.",
    images: img("hotbox-face-black"),
  },
  {
    id: "26c-007",
    slug: "hotbox-face-stone-grey",
    name: "Hotbox Face Tee",
    colorway: "Stone Grey",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The hotbox face graphic printed clean on heathered stone grey cotton. Dropped shoulders, boxy body, everyday oversized fit.",
    badge: "New Drop",
    images: img("hotbox-face-stone-grey"),
  },
  {
    id: "26c-003",
    slug: "trippy-ape-white",
    name: "Trippy Ape Tee",
    colorway: "White",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Our signature ape-face line art, printed small and clean on the chest of an off-white cotton tee. Understated and easy to wear.",
    images: img("trippy-ape-white"),
  },
  {
    id: "26c-004",
    slug: "trippy-ape-acid-black",
    name: "Trippy Ape Tee",
    colorway: "Acid Black",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Acid Wash Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Acid Wash",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The Trippy Ape face on an all-over acid-washed black base, no two tees fade exactly alike. Garment-washed for a broken-in feel.",
    badge: "New Drop",
    images: img("trippy-ape-acid-black"),
  },
  {
    id: "26c-013",
    slug: "trippy-ape-stone-grey",
    name: "Trippy Ape Tee",
    colorway: "Stone Grey",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Our signature ape-face line art, printed small and clean on the chest of a stone grey cotton tee. Understated and easy to wear.",
    badge: "New Drop",
    images: img("trippy-ape-stone-grey"),
  },
  {
    id: "26c-010",
    slug: "trippy-ape-joint-acid-wash",
    name: "Trippy Ape Dropping a Joint Tee",
    colorway: "Acid Wash",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Acid Wash Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Acid Wash",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Full back graphic of the trippy ape dropping a joint, printed clean on an all-over acid-washed black base. No two tees fade exactly alike.",
    badge: "New Drop",
    images: img("trippy-ape-joint-acid-wash"),
  },
  {
    id: "26c-005",
    slug: "melting-monkey-sand",
    name: "Melting Face Tee",
    colorway: "Sand",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A multi-color melting-face illustration in a hazy pastel wash, hand-inked outline over a swirling rainbow backdrop on sand cotton.",
    badge: "New Drop",
    images: img("melting-monkey-sand"),
  },
  {
    id: "26c-006",
    slug: "neon-monkey-black",
    name: "Neon Trip Tee",
    colorway: "Black",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Neon gradient line-art on black cotton, glow-in-the-dark energy without the glow. Bold, graphic, made to be seen.",
    images: img("neon-monkey-black"),
  },

  // ---------- Colored ----------
  {
    id: "26c-008",
    slug: "hotbox-face-sage-green",
    name: "Hotbox Face Tee",
    colorway: "Sage Green",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The hotbox face graphic printed clean on soft sage green cotton. Dropped shoulders, boxy body, everyday oversized fit.",
    badge: "New Drop",
    images: img("hotbox-face-sage-green"),
  },
  {
    id: "26c-009",
    slug: "hotbox-face-dusty-blue",
    name: "Hotbox Face Tee",
    colorway: "Dusty Blue",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The hotbox face graphic printed clean on dusty blue cotton. Dropped shoulders, boxy body, everyday oversized fit.",
    badge: "New Drop",
    images: img("hotbox-face-dusty-blue"),
  },
  {
    id: "26c-014",
    slug: "trippy-ape-sage-green",
    name: "Trippy Ape Tee",
    colorway: "Sage Green",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Our signature ape-face line art, printed small and clean on the chest of a sage green cotton tee. Understated and easy to wear.",
    badge: "New Drop",
    images: img("trippy-ape-sage-green"),
  },
  {
    id: "26c-015",
    slug: "trippy-ape-dusty-blue",
    name: "Trippy Ape Tee",
    colorway: "Dusty Blue",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Our signature ape-face line art, printed small and clean on the chest of a dusty blue cotton tee. Understated and easy to wear.",
    badge: "New Drop",
    images: img("trippy-ape-dusty-blue"),
  },
  {
    id: "26c-011",
    slug: "trippy-ape-joint-cosmic-swirl",
    name: "Trippy Ape Dropping a Joint Tee",
    colorway: "Cosmic Swirl",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Allover Print",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The trippy ape dropping a joint in neon line art, set against an allover galaxy print swirling across the whole shirt.",
    badge: "New Drop",
    images: img("trippy-ape-joint-cosmic-swirl"),
  },
  {
    id: "26c-012",
    slug: "trippy-ape-joint-psychedelic-pastel",
    name: "Trippy Ape Dropping a Joint Tee",
    colorway: "Psychedelic Pastel",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Tie-Dye",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The trippy ape dropping a joint, hand-inked over an allover pastel tie-dye base. Every tee dyed individually, no two alike.",
    badge: "New Drop",
    images: img("trippy-ape-joint-psychedelic-pastel"),
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
