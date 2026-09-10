import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAdminToken, ADMIN_COOKIE } from "@/lib/admin-auth";

// One-time bootstrap: only works while zero admin accounts exist. Once the
// first admin is created, this route always 403s — further admins must be
// added directly in the database by an existing admin.
export async function POST(req: Request) {
  const existingCount = await prisma.adminUser.count();
  if (existingCount > 0) {
    return NextResponse.json(
      { error: "Admin already set up" },
      { status: 403 }
    );
  }

  const { email, password, name } = await req.json();
  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and a password of at least 8 characters are required" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  const admin = await prisma.adminUser.create({
    data: { email, passwordHash, name: name || null },
  });

  const token = await signAdminToken({ id: admin.id, email: admin.email });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const existingCount = await prisma.adminUser.count();
  return NextResponse.json({ needsSetup: existingCount === 0 });
}
