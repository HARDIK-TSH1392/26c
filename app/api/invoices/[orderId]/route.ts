import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { invoice: true },
  });

  if (!order || !order.invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // Logged-in orders are only downloadable by their owner. Guest orders have
  // no account to check against — the unguessable order id is the access
  // control there (same trade-off as an emailed receipt link).
  if (order.userId) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== order.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
  }

  return new NextResponse(new Uint8Array(order.invoice.pdfData), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${order.invoice.invoiceNumber}.pdf"`,
    },
  });
}
