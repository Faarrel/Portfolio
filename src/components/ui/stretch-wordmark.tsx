export const WORD = ["F", "A", "A", "R", "R", "E", "L"] as const;
export const T = 28; // stem thickness in viewBox units
export const CELLS = [84, 106, 106, 96, 96, 84, 80] as const;
export const GAP = 12;
export const VB_W = CELLS.reduce((a, b) => a + b, 0) + GAP * (CELLS.length - 1); // 724
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

export const baseFor = (H: number, scale: number) =>
  scale > 0 ? Math.min(Math.max(Math.round((0.43 * H) / scale), 120), 460) : 220;

export const vbH = (base: number) => Math.ceil(base * STRETCH + 4);

export const pullAt = (d: number, W: number) =>
  W > 0 ? clamp01((FAR * W - Math.abs(d)) / ((FAR - NEAR) * W)) : 0;

export const f = (n: number) => (Math.round(n * 10) / 10).toString();

/**
 * Generates an open-stroke glyph path where only vertical/bottom stems stretch with `h`
 * while upper bowls, crossbars, and junctions remain pinned to `base`.
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
      const m = top + (bb - top) * 0.46;
      return (
        "M" + f(a) + " 0V" + f(h) +
        "M" + f(a) + " " + f(top) + "H" + f(ox + w) +
        "M" + f(a) + " " + f(m) + "H" + f(ox + w - 10)
      );
    }
    case "A": {
      const mid = (a + b) / 2;
      const elbow = top + (bb - top) * 0.48;
      const m = top + (bb - top) * 0.66;
      return (
        "M" + f(a) + " " + f(h) +
        "V" + f(elbow) +
        "L" + f(mid - 12) + " " + f(top) +
        "H" + f(mid + 12) +
        "L" + f(b) + " " + f(elbow) +
        "V" + f(h) +
        "M" + f(a) + " " + f(m) + "H" + f(b)
      );
    }
    case "R": {
      const m = top + (bb - top) * 0.46;
      const ru = Math.min(r * 0.9, (m - top) / 2);
      const rl = Math.min(r * 0.85, (bb - m) * 0.48);
      return (
        "M" + f(a) + " 0V" + f(h) +
        "M" + f(a) + " " + f(top) +
        "H" + f(b - ru) +
        "A" + f(ru) + " " + f(ru) + " 0 0 1 " + f(b) + " " + f(top + ru) +
        "V" + f(m - ru) +
        "A" + f(ru) + " " + f(ru) + " 0 0 1 " + f(b - ru) + " " + f(m) +
        "H" + f(a) +
        "M" + f(a + r * 0.45) + " " + f(m) +
        "H" + f(b - rl) +
        "A" + f(rl) + " " + f(rl) + " 0 0 1 " + f(b) + " " + f(m + rl) +
        "V" + f(h)
      );
    }
    case "E": {
      const m = top + (bb - top) * 0.48;
      return (
        "M" + f(a) + " 0V" + f(h) +
        "M" + f(a) + " " + f(top) + "H" + f(ox + w) +
        "M" + f(a) + " " + f(m) + "H" + f(ox + w - 10) +
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
