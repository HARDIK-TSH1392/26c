import geoip from "geoip-lite";

// The load balancer sets X-Forwarded-For as "<client-ip>, <proxy-ip>, ...";
// the first entry is the real original client.
export function getClientIp(forwardedFor: string | null): string | null {
  if (!forwardedFor) return null;
  return forwardedFor.split(",")[0]?.trim() || null;
}

// Defaults to India when the IP can't be resolved (local/private IPs,
// lookup misses) — the safe default, since that's also the real currency
// Razorpay actually charges in regardless of what's displayed.
export function isIndiaFromIp(ip: string | null): boolean {
  if (!ip) return true;
  const geo = geoip.lookup(ip);
  if (!geo) return true;
  return geo.country === "IN";
}
