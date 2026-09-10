import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(userId: string, addressId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  return address && address.userId === userId ? address : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const { id } = await params;

  const owned = await assertOwnership(session.user.id, id);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ address });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const { id } = await params;

  const owned = await assertOwnership(session.user.id, id);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
