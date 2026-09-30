// Display-only labels — the actual stored/selected size value stays the
// standard S/M/L/XL/XXL code everywhere (cart, order records, admin,
// invoices), only what's shown to the shopper changes.
export const SIZE_LABELS: Record<string, string> = {
  S: "Little Sexy",
  M: "Sexy",
  L: "Too Sexy",
  XL: "Way Too Sexy",
  XXL: "Way Too Sexy",
};

export function sizeLabel(size: string): string {
  return SIZE_LABELS[size] ?? size;
}
