// "Green Leaves Sale" — a quiet, unannounced flash sale at 4:20am and 4:20pm
// IST, for 5 minutes, at 42% off MRP. Timing is evaluated in IST regardless
// of server/browser locale so it fires at the same real-world moment for
// everyone. The actual charge is always recomputed server-side at checkout
// from this same function — the client's clock is only ever used for the
// visual/marketing display, never trusted for the real price.

export const SALE_DISCOUNT_PERCENT = 42;
export const SALE_HOUR_24 = [4, 16]; // 4:20am and 4:20pm IST
export const SALE_START_MINUTE = 20;
export const SALE_END_MINUTE = 25; // exclusive — 5 minute window

function getISTParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { hour: get("hour"), minute: get("minute"), second: get("second") };
}

// Dev-only override so we can demo this without waiting for a real 4:20.
// Guarded by NODE_ENV so it can never do anything in production, even if the
// env var somehow ended up set there.
function demoOverrideActive() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_GREEN_LEAVES_DEMO === "1"
  );
}

// Fakes a real, ticking 5-minute window for the local demo (loops every 5
// minutes so the demo never "ends"). Deliberately a pure function of the
// current wall-clock time rather than "time since some start moment" — a
// module-load-time anchor would differ between the long-lived server
// process (loaded once at boot) and a freshly loaded client bundle.
function demoSecondsElapsed(): number {
  return Math.floor(Date.now() / 1000) % (5 * 60);
}

export function isGreenLeavesSaleActive(date: Date = new Date()): boolean {
  if (demoOverrideActive()) return true;
  const { hour, minute } = getISTParts(date);
  return (
    SALE_HOUR_24.includes(hour) &&
    minute >= SALE_START_MINUTE &&
    minute < SALE_END_MINUTE
  );
}

// Seconds remaining in the current window — only meaningful while active.
export function secondsRemainingInSale(date: Date = new Date()): number {
  if (demoOverrideActive()) {
    return Math.max(0, 5 * 60 - demoSecondsElapsed());
  }
  const { minute, second } = getISTParts(date);
  const elapsed = (minute - SALE_START_MINUTE) * 60 + second;
  return Math.max(0, 5 * 60 - elapsed);
}

export function getSalePrice(mrp: number): number {
  return Math.round(mrp * (1 - SALE_DISCOUNT_PERCENT / 100));
}
