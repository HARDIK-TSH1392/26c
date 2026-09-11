import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      isWhatsApp: true,
      onboarded: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return NextResponse.json({ users });
}
