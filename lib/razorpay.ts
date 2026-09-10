import Razorpay from "razorpay";

export function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local"
    );
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}
