import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";

type CartLineInput = { slug: string; size: string; qty: number };
type CustomerInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  let body: {
    lines?: CartLineInput[];
    customer?: CustomerInput;
    addressId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { lines, addressId } = body;
  let { customer } = body;

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // If a saved address was picked, use it as the source of truth for shipping
  // info instead of requiring the client to resend it.
  let addressRecordId: string | null = null;
  if (addressId) {
    if (!session?.user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    addressRecordId = address.id;
    customer = {
      name: address.fullName,
      email: session.user.email ?? "",
      phone: address.phone,
      address: address.line2 ? `${address.line1}, ${address.line2}` : address.line1,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };
  }

  const requiredCustomerFields: (keyof CustomerInput)[] = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
  ];
  const missing = requiredCustomerFields.filter((f) => !customer?.[f]?.trim());
  if (!customer || missing.length > 0) {
    return NextResponse.json(
      { error: `Missing shipping details: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // Recompute the amount server-side from trusted product data — never trust
  // a price the client sends.
  let subtotal = 0;
  const orderItemsData: {
    productSlug: string;
    productName: string;
    colorway: string;
    size: string;
    qty: number;
    price: number;
  }[] = [];

  const outOfStock = await prisma.productStatus.findMany({
    where: { slug: { in: lines.map((l) => l.slug) }, inStock: false },
    select: { slug: true },
  });
  const outOfStockSlugs = new Set(outOfStock.map((s) => s.slug));

  for (const line of lines) {
    const product = products.find((p) => p.slug === line.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${line.slug}` },
        { status: 400 }
      );
    }
    if (outOfStockSlugs.has(product.slug)) {
      return NextResponse.json(
        { error: `${product.name} (${product.colorway}) is out of stock` },
        { status: 400 }
      );
    }
    if (!product.sizes.includes(line.size)) {
      return NextResponse.json(
        { error: `Invalid size "${line.size}" for ${product.name}` },
        { status: 400 }
      );
    }
    const qty = Number(line.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    subtotal += product.price * qty;
    orderItemsData.push({
      productSlug: product.slug,
      productName: product.name,
      colorway: product.colorway,
      size: line.size,
      qty,
      price: product.price,
    });
  }

  try {
    const razorpay = getRazorpay();
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(subtotal * 100), // paise
      currency: "INR",
      receipt: `26c_${Date.now()}`,
      notes: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: `${customer.address}, ${customer.city}, ${customer.state} ${customer.pincode}`,
      },
    });

    await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        addressId: addressRecordId,
        guestName: session?.user ? null : customer.name,
        guestEmail: session?.user ? null : customer.email,
        guestPhone: session?.user ? null : customer.phone,
        shippingSnapshot: JSON.stringify(customer),
        subtotal,
        status: "created",
        razorpayOrderId: rzpOrder.id,
        items: { create: orderItemsData },
      },
    });

    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
