export type UpcomingDesign = {
  id: string;
  slug: string;
  name: string;
  description: string;
  colorways: { name: string; image: string }[];
};

const cw = (slug: string, names: string[]) =>
  names.map((name, i) => ({
    name,
    image: `/coming-soon/${slug}-${i + 1}.webp`,
  }));

export const upcomingDesigns: UpcomingDesign[] = [
  {
    id: "up-01",
    slug: "01-trippy-ape",
    name: "Trippy Ape",
    description: "The 26c ape-face mark, offered in five new washes.",
    colorways: cw("01-trippy-ape", [
      "Vintage White",
      "Stone Grey",
      "Sage Green",
      "Dusty Blue",
      "Faded Black",
    ]),
  },
  {
    id: "up-02",
    slug: "02-too-sexy-french",
    name: "Too Sexy (French)",
    description: "“trop sexy” — minimal wordmark tee, five pastel colorways.",
    colorways: cw("02-too-sexy-french", [
      "Butter Yellow",
      "Lavender",
      "Seafoam",
      "Sky Blue",
      "Coral",
    ]),
  },
  {
    id: "up-03",
    slug: "03-too-sexy-spanish",
    name: "Too Sexy (Spanish)",
    description: "“demasiado sexy” — minimal wordmark tee, five deep colorways.",
    colorways: cw("03-too-sexy-spanish", [
      "Vintage White",
      "Washed Charcoal",
      "Olive Green",
      "Deep Plum",
      "Jet Black",
    ]),
  },
  {
    id: "up-04",
    slug: "04-too-sexy-japanese",
    name: "Too Sexy (Japanese)",
    description: "セクシーすぎる — minimal wordmark tee, five cosmic colorways.",
    colorways: cw("04-too-sexy-japanese", [
      "Astro Black",
      "Moon Grey",
      "Cosmic Navy",
      "Nebula Purple",
      "Planet Sand",
    ]),
  },
  {
    id: "up-05",
    slug: "05-too-sexy-worldwide",
    name: "Too Sexy — Worldwide",
    description:
      "“Too sexy” in multiple languages banded around the hem, five colorways.",
    colorways: cw("05-too-sexy-worldwide", [
      "Sand",
      "Sage",
      "Dusty Blue",
      "Terracotta",
      "Charcoal",
    ]),
  },
  {
    id: "up-08",
    slug: "08-band",
    name: "Band",
    description: "Three-piece band line art, back print, five colorways.",
    colorways: cw("08-band", [
      "Vintage Black",
      "Faded Navy",
      "Off White",
      "Forest Green",
      "Washed Maroon",
    ]),
  },
  {
    id: "up-09",
    slug: "09-spiral",
    name: "Lost In The Right Place",
    description: "Spiral back graphic, five colorways.",
    colorways: cw("09-spiral", [
      "Vintage Black",
      "Faded Navy",
      "Off White",
      "Sage Green",
      "Washed Maroon",
    ]),
  },
  {
    id: "up-10",
    slug: "10-wordmark",
    name: "Underline Wordmark",
    description: "Simple 26c back wordmark, five colorways.",
    colorways: cw("10-wordmark", [
      "Vintage Black",
      "Faded Navy",
      "Off White",
      "Forest Green",
      "Washed Maroon",
    ]),
  },
];
