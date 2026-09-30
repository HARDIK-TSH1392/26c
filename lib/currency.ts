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

// Green Leaves Sale discount applied to the USD price — same %-off used for
// the real INR sale price, just on the USD figure.
export function usdSalePrice(inrPrice: number): number {
  return Math.round(usdPrice(inrPrice) * (1 - SALE_DISCOUNT_PERCENT / 100));
}

export function money(amount: number, isIndia: boolean): string {
  return isIndia ? `₹${amount}` : `$${amount}`;
}
