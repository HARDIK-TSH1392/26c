import { SALE_DISCOUNT_PERCENT } from "@/lib/green-leaves-sale";

// Friendly USD price points chosen directly (not a live FX conversion) —
// ₹699 tees show as $10, ₹799 tees show as $15. This is a *display-only*
// convenience for browsing outside India: the actual Razorpay charge is
// always in INR (that's the only currency Razorpay processes for this
// account), regardless of what's shown while browsing.
const USD_BASE_PRICE: Record<number, number> = { 699: 10, 799: 15 };

// Fallback for any price point not in the table above (e.g. a future
// product added at a new price), so the site never breaks — just less of
// a "clean" number than the hand-picked ones above.
const FALLBACK_INR_PER_USD = 83;

export function usdPrice(inrPrice: number): number {
  return USD_BASE_PRICE[inrPrice] ?? Math.round(inrPrice / FALLBACK_INR_PER_USD);
}

// Derives a USD "MRP" that preserves the same %-off relationship as the INR
// price/mrp pair, so the discount badge (e.g. "20% off") reads the same
// percentage in both currencies instead of a mismatched one.
export function usdMrp(inrPrice: number, inrMrp: number): number {
  const price = usdPrice(inrPrice);
  if (inrMrp <= inrPrice) return price;
  const discountFraction = (inrMrp - inrPrice) / inrMrp;
  return Math.round(price / (1 - discountFraction));
}

// Green Leaves Sale (42% off) applied to the derived USD MRP — same formula
// already used for the real INR sale price, just on the USD figure.
export function usdSalePrice(inrPrice: number, inrMrp: number): number {
  return Math.round(usdMrp(inrPrice, inrMrp) * (1 - SALE_DISCOUNT_PERCENT / 100));
}

export function money(amount: number, isIndia: boolean): string {
  return isIndia ? `₹${amount}` : `$${amount}`;
}
