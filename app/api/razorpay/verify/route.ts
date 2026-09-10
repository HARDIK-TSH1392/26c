import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/invoice";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "Razorpay is not configured" },
      { status: 500 }
    );
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
    include: { items: true, user: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "paid", razorpayPaymentId: razorpay_payment_id },
  });

  const shipTo = JSON.parse(order.shippingSnapshot) as {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  // Generate + store the invoice, then best-effort email it. Neither of these
  // should block the customer from seeing a successful payment if they fail.
  let invoiceNumber = "";
  try {
    invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const pdfBytes = await generateInvoicePdf({
      invoiceNumber,
      orderId: order.id,
      razorpayPaymentId: razorpay_payment_id,
      createdAt: order.createdAt,
      subtotal: order.subtotal,
      items: order.items.map((i) => ({
        productName: i.productName,
        colorway: i.colorway,
        size: i.size,
        qty: i.qty,
        price: i.price,
      })),
      shipTo,
    });

    await prisma.invoice.create({
      data: {
        orderId: order.id,
        invoiceNumber,
        pdfData: Buffer.from(pdfBytes),
      },
    });

    const emailResult = await sendInvoiceEmail({
      to: shipTo.email,
      customerName: shipTo.name,
      orderId: order.id,
      invoiceNumber,
      subtotal: order.subtotal,
      pdf: pdfBytes,
    });

    if (emailResult.sent) {
      await prisma.invoice.update({
        where: { orderId: order.id },
        data: { emailSentAt: new Date() },
      });
    }
  } catch (err) {
    console.error("Invoice generation/email failed:", err);
  }

  return NextResponse.json({
    verified: true,
    paymentId: razorpay_payment_id,
    orderId: order.id,
  });
}
