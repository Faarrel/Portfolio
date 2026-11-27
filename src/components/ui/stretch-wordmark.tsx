export const WORD = ["F", "A", "A", "R", "R", "E", "L"] as const;
export const T = 24; // balanced geometric Montserrat-style stroke thickness
export const CELLS = [96, 118, 118, 106, 106, 96, 90] as const;
export const GAP = 16;
export const VB_W = CELLS.reduce((a, b) => a + b, 0) + GAP * (CELLS.length - 1); // 826
export const STRETCH = 1.89;
export const NEAR = 0.139;
export const FAR = 0.462;
export const TAU_LETTER = 105;
export const LOOK = 175;
export const TAU_LOOK = 300;
export const SPIN = 6;

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const approach = (cur: number, target: number, dt: number, tau: number) =>
  target + (cur - target) * Math.exp(-Math.max(0, dt) / tau);

export const cellX = (i: number) => CELLS.slice(0, i).reduce((a, b) => a + b, 0) + GAP * i;
export const cellMid = (i: number) => cellX(i) + CELLS[i] / 2;

/** Geometric Montserrat proportions (~34% stage height on desktop, balanced clamp on narrow mobile). */
export const baseFor = (H: number, scale: number) =>
  scale > 0 ? Math.min(Math.max(Math.round((0.34 * H) / scale), 136), 210) : 172;

export const vbH = (base: number) => Math.ceil(base * STRETCH + 4);

export const pullAt = (d: number, W: number) =>
  W > 0 ? clamp01((FAR * W - Math.abs(d)) / ((FAR - NEAR) * W)) : 0;

export const f = (n: number) => (Math.round(n * 10) / 10).toString();

/**
 * Generates Montserrat-proportioned geometric SVG glyph paths where only bottom vertical
 * stems lengthen with `h`, keeping upper bowls, diagonals, and crossbars anchored to `base`.
 */
export function glyph(ch: (typeof WORD)[number], ox: number, w: number, h: number, base: number) {
  h = Math.max(h, base);
  const a = ox + T / 2;
  const b = ox + w - T / 2;
  const top = T / 2;
  const bot = h - T / 2;
  const bb = base - T / 2;
  const r = (b - a) / 2;

  switch (ch) {
    case "F": {
      const m = top + (bb - top) * 0.48;
      return (
        "M" + f(a) + " 0V" + f(h) +
        "M" + f(a) + " " + f(top) + "H" + f(ox + w) +
        "M" + f(a) + " " + f(m) + "H" + f(ox + w - 14)
      );
    }
    case "A": {
      const mid = (a + b) / 2;
      const elbow = top + (bb - top) * 0.56;
      const m = top + (bb - top) * 0.68;
      return (
        "M" + f(a) + " " + f(h) +
        "V" + f(elbow) +
        "L" + f(mid - 11) + " " + f(top) +
        "H" + f(mid + 11) +
        "L" + f(b) + " " + f(elbow) +
        "V" + f(h) +
        "M" + f(a) + " " + f(m) + "H" + f(b)
      );
    }
    case "R": {
      const m = top + (bb - top) * 0.5;
      const ru = Math.min(r * 0.85, (m - top) / 2);
      const knee = m + (bb - m) * 0.62;
      return (
        "M" + f(a) + " 0V" + f(h) +
        "M" + f(a) + " " + f(top) +
        "H" + f(b - ru) +
        "A" + f(ru) + " " + f(ru) + " 0 0 1 " + f(b) + " " + f(top + ru) +
        "V" + f(m - ru) +
        "A" + f(ru) + " " + f(ru) + " 0 0 1 " + f(b - ru) + " " + f(m) +
        "H" + f(a) +
        "M" + f(a + (b - a) * 0.44) + " " + f(m) +
        "L" + f(b) + " " + f(knee) +
        "V" + f(h)
      );
    }
    case "E": {
      const m = top + (bb - top) * 0.48;
      return (
        "M" + f(a) + " 0V" + f(h) +
        "M" + f(a) + " " + f(top) + "H" + f(ox + w) +
        "M" + f(a) + " " + f(m) + "H" + f(ox + w - 14) +
        "M" + f(a) + " " + f(bot) + "H" + f(ox + w)
      );
    }
    case "L": {
      return "M" + f(a) + " 0V" + f(bot) + "H" + f(ox + w);
    }
  }
}

export function stretchTargets(px: number | null, centres: number[], W: number, base: number, out: number[]) {
  for (let i = 0; i < WORD.length; i++) {
    out[i] = px === null ? base : base * (1 + (STRETCH - 1) * pullAt((centres[i] ?? 0) - px, W));
  }
  return out;
}

export const lookAt = (nx: number, ny: number) => ({
  rx: -LOOK * Math.max(-1, Math.min(1, ny)),
  ry: LOOK * Math.max(-1, Math.min(1, nx)),
});
