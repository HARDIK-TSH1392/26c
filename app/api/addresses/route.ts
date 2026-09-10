import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ addresses });
}

type AddressInput = {
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body: AddressInput = await req.json();
  const required: (keyof AddressInput)[] = [
    "fullName",
    "phone",
    "line1",
    "city",
    "state",
    "pincode",
  ];
  const missing = required.filter((f) => !body[f]?.toString().trim());
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const existingCount = await prisma.address.count({
    where: { userId: session.user.id },
  });

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      label: body.label || "Home",
      fullName: body.fullName,
      phone: body.phone,
      line1: body.line1,
      line2: body.line2 || null,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      isDefault: body.isDefault ?? existingCount === 0, // first address is default
    },
  });

  return NextResponse.json({ address });
}
