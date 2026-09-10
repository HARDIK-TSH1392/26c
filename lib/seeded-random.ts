// Deterministic pseudo-random in [0,1) — same value on server and client so
// animated decorative elements never cause a hydration mismatch the way
// Math.random() would.
export function seededRandom(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Even coverage without a visible grid: divide a unit square into cols x
// rows cells, drop item i into its own cell, then jitter it within that
// cell. Plain per-item randomness (seededRandom(i * k)) tends to clump —
// this guarantees every region gets roughly one item while still looking
// scattered. Returns fractional {cx, cy} in [0, 1]; scale to your own
// x/y ranges.
export function stratifiedPoint(
  i: number,
  cols: number,
  rows: number,
  seedOffset = 0,
  jitter = 0.85
): { cx: number; cy: number } {
  const col = i % cols;
  const row = Math.floor(i / cols) % rows;
  const cellW = 1 / cols;
  const cellH = 1 / rows;
  const jx = (seededRandom(seedOffset + i * 3.17 + 1) - 0.5) * cellW * jitter;
  const jy = (seededRandom(seedOffset + i * 5.71 + 2) - 0.5) * cellH * jitter;
  const cx = Math.min(1, Math.max(0, (col + 0.5) * cellW + jx));
  const cy = Math.min(1, Math.max(0, (row + 0.5) * cellH + jy));
  return { cx, cy };
}
