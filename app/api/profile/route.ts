import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      isWhatsApp: true,
      dob: true,
      onboarded: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, isWhatsApp, dob } = body as {
    name?: string;
    phone?: string;
    isWhatsApp?: boolean;
    dob?: string | null;
  };

  if (phone !== undefined && !/^[0-9]{10}$/.test(phone)) {
    return NextResponse.json(
      { error: "Phone must be a 10-digit number" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone, onboarded: true } : {}),
      ...(isWhatsApp !== undefined ? { isWhatsApp } : {}),
      ...(dob !== undefined ? { dob: dob ? new Date(dob) : null } : {}),
    },
  });

  return NextResponse.json({ user });
}
