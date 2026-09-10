import { Resend } from "resend";

export async function sendInvoiceEmail(opts: {
  to: string;
  customerName: string;
  orderId: string;
  invoiceNumber: string;
  subtotal: number;
  pdf: Uint8Array;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping invoice email");
    return { sent: false, reason: "not_configured" as const };
  }

  const resend = new Resend(apiKey);

  // Resend requires a verified domain to send from a custom address like
  // orders@yourdomain.com — until you verify one (Resend dashboard > Domains),
  // sending only works from this onboarding@resend.dev sandbox address.
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "26c <onboarding@resend.dev>",
    to: opts.to,
    subject: `You are too sexy for shopping 😉 — Order confirmed (${opts.invoiceNumber})`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="margin-bottom: 4px;">26c</h2>
        <p style="color:#666;">Hand-drawn graphic tees</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p>Hi ${opts.customerName},</p>
        <p>
          <strong>You are too sexy for shopping from us 😉</strong><br/>
          Your order <strong>${opts.orderId.slice(0, 10)}</strong> is confirmed —
          total <strong>₹${opts.subtotal}</strong>.
        </p>
        <p>Estimated delivery: <strong>10-12 business days</strong>.</p>
        <p>Your invoice is attached to this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color:#999; font-size: 12px;">26c — Graphic Tees</p>
      </div>
    `,
    attachments: [
      {
        filename: `${opts.invoiceNumber}.pdf`,
        content: Buffer.from(opts.pdf).toString("base64"),
      },
    ],
  });

  if (error) {
    console.error("Failed to send invoice email:", error);
    return { sent: false, reason: "send_failed" as const };
  }

  return { sent: true };
}
