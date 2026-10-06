export type Product = {
  id: string;
  slug: string;
  name: string;
  colorway: string;
  price: number;
  mrp: number;
  category: string;
  // Optional — only applies to printed apparel. Accessories (sunglasses
  // etc.) leave this unset and the spec table just skips that row.
  printType?: "Solid Print" | "Multi-Color Print" | "Acid Wash Print";
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
    name: "My Face Is Melting",
    colorway: "Sand",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "One more puff and my face is melting.",
    badge: "Bestseller",
    images: img("hotbox-face-sand"),
  },
  {
    id: "26c-002",
    slug: "hotbox-face-black",
    name: "My Face Is Melting",
    colorway: "Black",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "One more puff and my face is melting.",
    images: img("hotbox-face-black"),
  },
  {
    id: "26c-007",
    slug: "hotbox-face-stone-grey",
    name: "My Face Is Melting",
    colorway: "Stone Grey",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "One more puff and my face is melting.",
    badge: "New Drop",
    images: img("hotbox-face-stone-grey"),
  },
  {
    id: "26c-003",
    slug: "trippy-ape-white",
    name: "John Doe",
    colorway: "White",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "John Doe ain't John Doe.",
    images: img("trippy-ape-white"),
  },
  {
    id: "26c-004",
    slug: "trippy-ape-acid-black",
    name: "John Doe",
    colorway: "Acid Black",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Acid Wash Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Acid Wash",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "John Doe ain't John Doe.",
    badge: "New Drop",
    images: img("trippy-ape-acid-black"),
  },
  {
    id: "26c-013",
    slug: "trippy-ape-stone-grey",
    name: "John Doe",
    colorway: "Stone Grey",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "John Doe ain't John Doe.",
    badge: "New Drop",
    images: img("trippy-ape-stone-grey"),
  },
  {
    id: "26c-010",
    slug: "trippy-ape-joint-acid-wash",
    name: "Superboof",
    colorway: "Acid Wash",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Acid Wash Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Acid Wash",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Superboof tastes like shit.",
    badge: "New Drop",
    images: img("trippy-ape-joint-acid-wash"),
  },
  {
    id: "26c-005",
    slug: "melting-monkey-sand",
    name: "Superboof",
    colorway: "Sand",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Superboof tastes like shit.",
    badge: "New Drop",
    images: img("melting-monkey-sand"),
  },
  {
    id: "26c-006",
    slug: "neon-monkey-black",
    name: "Superboof",
    colorway: "Black",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Superboof tastes like shit.",
    images: img("neon-monkey-black"),
  },

  // ---------- Colored ----------
  {
    id: "26c-008",
    slug: "hotbox-face-sage-green",
    name: "My Face Is Melting",
    colorway: "Sage Green",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "One more puff and my face is melting.",
    badge: "New Drop",
    images: img("hotbox-face-sage-green"),
  },
  {
    id: "26c-009",
    slug: "hotbox-face-dusty-blue",
    name: "My Face Is Melting",
    colorway: "Dusty Blue",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "One more puff and my face is melting.",
    badge: "New Drop",
    images: img("hotbox-face-dusty-blue"),
  },
  {
    id: "26c-014",
    slug: "trippy-ape-sage-green",
    name: "John Doe",
    colorway: "Sage Green",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "John Doe ain't John Doe.",
    badge: "New Drop",
    images: img("trippy-ape-sage-green"),
  },
  {
    id: "26c-015",
    slug: "trippy-ape-dusty-blue",
    name: "John Doe",
    colorway: "Dusty Blue",
    price: 799,
    mrp: 999,
    category: "Oversized T-Shirts",
    printType: "Solid Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "John Doe ain't John Doe.",
    badge: "New Drop",
    images: img("trippy-ape-dusty-blue"),
  },
  {
    id: "26c-011",
    slug: "trippy-ape-joint-cosmic-swirl",
    name: "Superboof",
    colorway: "Cosmic Swirl",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Allover Print",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Superboof tastes like shit.",
    badge: "New Drop",
    images: img("trippy-ape-joint-cosmic-swirl"),
  },
  {
    id: "26c-012",
    slug: "trippy-ape-joint-psychedelic-pastel",
    name: "Superboof",
    colorway: "Psychedelic Pastel",
    price: 699,
    mrp: 899,
    category: "Oversized T-Shirts",
    printType: "Multi-Color Print",
    fit: "Oversized Fit",
    fabric: "230 GSM 100% Cotton, Tie-Dye",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Superboof tastes like shit.",
    badge: "New Drop",
    images: img("trippy-ape-joint-psychedelic-pastel"),
  },

  // ---------- Accessories ----------
  {
    id: "26c-016",
    slug: "vice-sunglasses",
    name: "Vice",
    colorway: "Silver",
    price: 1299,
    mrp: 1299,
    category: "Sunglasses",
    fit: "One Size",
    fabric: "Metal Frame, UV400 Tinted Lenses",
    sizes: ["One Size"],
    description: "Vice sees everything. Vice says nothing.",
    images: {
      flat: `${GCS_BASE}/vice-sunglasses/studio.webp`,
      closeup: `${GCS_BASE}/vice-sunglasses/lifestyle.webp`,
      front: `${GCS_BASE}/vice-sunglasses/studio.webp`,
      back: `${GCS_BASE}/vice-sunglasses/lifestyle.webp`,
      flatCard: `${GCS_BASE}/vice-sunglasses/lifestyle.webp`,
      frontCard: `${GCS_BASE}/vice-sunglasses/studio.webp`,
    },
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
