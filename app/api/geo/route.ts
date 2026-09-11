import { NextResponse } from "next/server";
import { getClientIp, isIndiaFromIp } from "@/lib/geo";

export async function GET(req: Request) {
  const ip = getClientIp(req.headers.get("x-forwarded-for"));
  const isIndia = isIndiaFromIp(ip);

  // Per-visitor result — must never be cached (by the browser, or by Cloud
  // CDN in front of this service), or every later visitor would get
  // whichever country answered first.
  return NextResponse.json(
    { isIndia },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
