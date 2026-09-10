import { prisma } from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/invoice";
import { sendInvoiceEmail } from "@/lib/email";

// Shared by both the client-side verify callback and the Razorpay webhook —
// whichever fires first does the work; idempotent so the second one is a
// no-op. This is what makes the webhook a real backstop: if the customer's
// browser never calls /verify (closed tab, lost connection), the webhook
// still confirms the order and sends the invoice.
export async function confirmOrderPaid(
  razorpayOrderId: string,
  razorpayPaymentId: string
) {
  const order = await prisma.order.findUnique({
    where: { razorpayOrderId },
    include: { items: true, invoice: true },
  });

  if (!order) {
    return { ok: false as const, reason: "not_found" as const };
  }

  if (order.status !== "created") {
    // Already confirmed by the other path (or further along, e.g. shipped).
    return { ok: true as const, orderId: order.id, alreadyProcessed: true };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "paid", razorpayPaymentId },
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
  // should block confirmation if they fail.
  try {
    if (!order.invoice) {
      const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
      const pdfBytes = await generateInvoicePdf({
        invoiceNumber,
        orderId: order.id,
        razorpayPaymentId,
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
    }
  } catch (err) {
    console.error("Invoice generation/email failed:", err);
  }

  return { ok: true as const, orderId: order.id, alreadyProcessed: false };
}
