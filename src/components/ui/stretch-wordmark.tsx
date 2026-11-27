export const WORD = ["F", "A", "A", "R", "R", "E", "L"] as const;
export const BASE = 700; // true Montserrat ExtraBold cap height (unitsPerEm = 1000)

/** Optical x-offsets and widths derived directly from Montserrat ExtraBold metrics. */
export const CELLS = [
  { x: 0, w: 619, mid: 344 },      // F
  { x: 602, w: 786, mid: 995 },    // A (kerns tucked slightly under F's top arm)
  { x: 1430, w: 786, mid: 1823 },  // A
  { x: 2210, w: 715, mid: 2602 },  // R
  { x: 2930, w: 715, mid: 3322 },  // R
  { x: 3660, w: 632, mid: 4011 },  // E
  { x: 4310, w: 602, mid: 4646 },  // L
] as const;

export const VB_W = 4912;
export const STRETCH = 2.15;
export const VB_H = Math.ceil(BASE * STRETCH + 40);
export const NEAR = 0.139;
export const FAR = 0.462;
export const TAU_LETTER = 105;
export const LOOK = 175;
export const TAU_LOOK = 300;
export const SPIN = 6;

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const approach = (cur: number, target: number, dt: number, tau: number) =>
  target + (cur - target) * Math.exp(-Math.max(0, dt) / tau);

export const cellMid = (i: number) => CELLS[i].mid;

export const pullAt = (d: number, W: number) =>
  W > 0 ? clamp01((FAR * W - Math.abs(d)) / ((FAR - NEAR) * W)) : 0;

export const f = (n: number) => (Math.round(n * 10) / 10).toString();

/**
 * Generates authentic Montserrat ExtraBold SVG outlines (`fillRule="evenodd"`)
 * where only the flat-bottom stems/feet extend downward by `dh = h - BASE`,
 * keeping curves, diagonals, and crossbars 100% locked to the typeface geometry.
 */
export function glyph(ch: (typeof WORD)[number], ox: number, h: number) {
  const dh = Math.max(0, h - BASE);
  const bot = f(BASE + dh);

  switch (ch) {
    case "F":
      return (
        `M${ox + 70} ${bot}V0H${ox + 619}V153H${ox + 268}V307H${ox + 577}V460H${ox + 268}V${bot}Z`
      );
    case "A":
      return (
        `M${ox - 14} ${bot}V700L${ox + 295} 0H${ox + 490}L${ox + 800} 700V${bot}H${ox + 594}V700L${ox + 539} 564H${ox + 243}L${ox + 188} 700V${bot}Z` +
        `M${ox + 301} 418H${ox + 481}L${ox + 391} 194Z`
      );
    case "R":
      return (
        `M${ox + 70} ${bot}V0H${ox + 383}` +
        `Q${ox + 537} 0 ${ox + 619} 69.5` +
        `Q${ox + 701} 139 ${ox + 701} 259` +
        `Q${ox + 701} 336 ${ox + 665} 392.5` +
        `Q${ox + 629} 449 ${ox + 563} 480` +
        `L${ox + 715} 700V${bot}H${ox + 503}V700L${ox + 376} 514H${ox + 268}V${bot}Z` +
        `M${ox + 268} 361H${ox + 378}` +
        `Q${ox + 440} 361 ${ox + 470.5} 334` +
        `Q${ox + 501} 307 ${ox + 501} 259` +
        `Q${ox + 501} 210 ${ox + 470.5} 183` +
        `Q${ox + 440} 156 ${ox + 378} 156H${ox + 268}Z`
      );
    case "E": {
      const topOfFoot = f(547 + dh);
      return (
        `M${ox + 70} ${bot}V0H${ox + 619}V153H${ox + 266}V271H${ox + 577}V419H${ox + 266}V${topOfFoot}H${ox + 632}V${bot}Z`
      );
    }
    case "L": {
      const topOfFoot = f(543 + dh);
      return (
        `M${ox + 70} ${bot}V0H${ox + 268}V${topOfFoot}H${ox + 602}V${bot}Z`
      );
    }
  }
}

export function stretchTargets(px: number | null, centres: number[], W: number, out: number[]) {
  for (let i = 0; i < WORD.length; i++) {
    out[i] = px === null ? BASE : BASE * (1 + (STRETCH - 1) * pullAt((centres[i] ?? 0) - px, W));
  }
  return out;
}

export const lookAt = (nx: number, ny: number) => ({
  rx: -LOOK * Math.max(-1, Math.min(1, ny)),
  ry: LOOK * Math.max(-1, Math.min(1, nx)),
});
