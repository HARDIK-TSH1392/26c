import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type InvoiceOrderItem = {
  productName: string;
  colorway: string;
  size: string;
  qty: number;
  price: number;
};

export type InvoiceData = {
  invoiceNumber: string;
  orderId: string;
  razorpayPaymentId: string | null;
  createdAt: Date;
  subtotal: number;
  items: InvoiceOrderItem[];
  shipTo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  gstin?: string | null;
};

const INK = rgb(0.08, 0.08, 0.08);
const GREY = rgb(0.45, 0.45, 0.45);
const LINE = rgb(0.85, 0.83, 0.8);

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  let y = 800;

  const text = (
    str: string,
    x: number,
    yy: number,
    opts: { size?: number; f?: typeof font; color?: ReturnType<typeof rgb> } = {}
  ) => {
    page.drawText(str, {
      x,
      y: yy,
      size: opts.size ?? 10,
      font: opts.f ?? font,
      color: opts.color ?? INK,
    });
  };

  // header
  text("26c", margin, y, { size: 26, f: bold });
  text("TAX INVOICE", 595.28 - margin - 110, y, { size: 14, f: bold });
  y -= 18;
  text("Graphic Tees", margin, y, { size: 10, color: GREY });
  if (data.gstin) {
    text(`GSTIN: ${data.gstin}`, 595.28 - margin - 150, y, { size: 9, color: GREY });
  }
  y -= 40;

  page.drawLine({
    start: { x: margin, y },
    end: { x: 595.28 - margin, y },
    thickness: 1,
    color: LINE,
  });
  y -= 24;

  // invoice meta + ship-to, two columns
  const leftX = margin;
  const rightX = 320;

  text("Invoice Number", leftX, y, { size: 8, color: GREY });
  text("Ship To", rightX, y, { size: 8, color: GREY });
  y -= 13;
  text(data.invoiceNumber, leftX, y, { size: 10, f: bold });
  text(data.shipTo.name, rightX, y, { size: 10, f: bold });
  y -= 14;
  text(`Order ${data.orderId.slice(0, 10)}`, leftX, y, { size: 9, color: GREY });
  text(data.shipTo.address, rightX, y, { size: 9 });
  y -= 13;
  text(data.createdAt.toDateString(), leftX, y, { size: 9, color: GREY });
  text(`${data.shipTo.city}, ${data.shipTo.state} ${data.shipTo.pincode}`, rightX, y, {
    size: 9,
  });
  y -= 13;
  if (data.razorpayPaymentId) {
    text(`Payment ID: ${data.razorpayPaymentId}`, leftX, y, { size: 8, color: GREY });
  }
  text(`Phone: ${data.shipTo.phone}`, rightX, y, { size: 9 });
  y -= 36;

  // items table header
  const col = { name: margin, size: 300, qty: 370, price: 430, total: 500 };
  text("Item", col.name, y, { size: 9, f: bold });
  text("Size", col.size, y, { size: 9, f: bold });
  text("Qty", col.qty, y, { size: 9, f: bold });
  text("Price", col.price, y, { size: 9, f: bold });
  text("Total", col.total, y, { size: 9, f: bold });
  y -= 8;
  page.drawLine({
    start: { x: margin, y },
    end: { x: 595.28 - margin, y },
    thickness: 1,
    color: LINE,
  });
  y -= 18;

  for (const item of data.items) {
    text(`${item.productName} — ${item.colorway}`, col.name, y, { size: 9 });
    text(item.size, col.size, y, { size: 9 });
    text(String(item.qty), col.qty, y, { size: 9 });
    text(`Rs ${item.price}`, col.price, y, { size: 9 });
    text(`Rs ${item.price * item.qty}`, col.total, y, { size: 9 });
    y -= 20;
  }

  y -= 6;
  page.drawLine({
    start: { x: margin, y },
    end: { x: 595.28 - margin, y },
    thickness: 1,
    color: LINE,
  });
  y -= 24;

  text("Subtotal", col.price, y, { size: 10, f: bold });
  text(`Rs ${data.subtotal}`, col.total, y, { size: 10, f: bold });
  y -= 50;

  text(
    "Estimated delivery: 10-12 business days.",
    margin,
    y,
    { size: 9, color: GREY }
  );
  y -= 40;

  text("You are too sexy for shopping — thank you for ordering from 26c.", margin, y, {
    size: 10,
    f: bold,
  });

  return doc.save();
}
