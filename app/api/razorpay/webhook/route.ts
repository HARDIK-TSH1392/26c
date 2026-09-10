import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { confirmOrderPaid } from "@/lib/order-confirmation";

// Server-to-server confirmation from Razorpay — the authoritative backstop
// for the client-side /verify callback. Configure this URL in Razorpay
// Dashboard > Settings > Webhooks (per mode: test and live are separate),
// subscribe to at least "payment.captured", and put the webhook secret it
// gives you into RAZORPAY_WEBHOOK_SECRET.
export async function POST(req: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not set — rejecting webhook");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          status?: string;
        };
      };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Log every webhook delivery for auditability, regardless of event type.
  console.log(`[razorpay webhook] ${event.event}`, {
    paymentId: event.payload?.payment?.entity?.id,
    orderId: event.payload?.payment?.entity?.order_id,
  });

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id && payment?.id) {
      const result = await confirmOrderPaid(payment.order_id, payment.id);
      if (!result.ok) {
        console.error(
          `[razorpay webhook] payment.captured for unknown order ${payment.order_id}`
        );
      }
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id) {
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: payment.order_id },
      });
      // Only mark failed if we haven't already confirmed it paid via the
      // other path — a late "failed" webhook for an already-paid order
      // (e.g. a duplicate delivery) should never downgrade a real payment.
      if (order && order.status === "created") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "failed" },
        });
      }
    }
  }

  // Always 200 on anything we understood, so Razorpay doesn't retry forever.
  return NextResponse.json({ received: true });
}
