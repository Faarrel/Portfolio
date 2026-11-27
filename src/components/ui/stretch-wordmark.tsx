"use client";

import {
  useEffect,
  useId,
  useRef,
  type RefObject,
} from "react";

const WORD = ["F", "A", "A", "R", "R", "E", "L"] as const;
const T = 28; // stem thickness in viewBox units
const CELLS = [84, 106, 106, 96, 96, 84, 80] as const;
const GAP = 12;
const VB_W = CELLS.reduce((a, b) => a + b, 0) + GAP * (CELLS.length - 1); // 724
const BASE = 148;
const STRETCH = 1.78;
const NEAR = 0.139;
const FAR = 0.462;
const TAU_LETTER = 105;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const approach = (cur: number, target: number, dt: number, tau: number) =>
  target + (cur - target) * Math.exp(-Math.max(0, dt) / tau);

const cellX = (i: number) => CELLS.slice(0, i).reduce((a, b) => a + b, 0) + GAP * i;
const cellMid = (i: number) => cellX(i) + CELLS[i] / 2;
const pullAt = (d: number, W: number) =>
  W > 0 ? clamp01((FAR * W - Math.abs(d)) / ((FAR - NEAR) * W)) : 0;

const f = (n: number) => (Math.round(n * 10) / 10).toString();

function glyph(ch: (typeof WORD)[number], ox: number, w: number, h: number, base: number) {
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
      return (
        "M" + f(a) + " 0V" + f(bot) + "H" + f(ox + w)
      );
    }
  }
}

export interface StretchWordmarkProps {
  /** Ref to the surrounding interactive hero container for pointer tracking. */
  containerRef: RefObject<HTMLElement | null>;
  /** Optional ref to element below wordmark to push smoothly downward as stems extend. */
  subtitleRef?: RefObject<HTMLElement | null>;
  className?: string;
}

export default function StretchWordmark({
  containerRef,
  subtitleRef,
  className,
}: StretchWordmarkProps) {
  const wordRef = useRef<HTMLDivElement | null>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const clipId = "faarrel-clip-" + useId().replace(/[^a-zA-Z0-9]/g, "");

  const stateRef = useRef({
    W: 0,
    left: 0,
    scale: 1,
    centres: WORD.map(() => 0),
    hs: WORD.map(() => BASE),
    tg: WORD.map(() => BASE),
    fine: false,
    still: false,
    last: 0,
    px: -1,
    over: false,
    touching: false,
    visible: true,
    raf: 0,
    lastD: WORD.map(() => ""),
    lastSubY: "",
  });

  useEffect(() => {
    const container = containerRef.current;
    const wordEl = wordRef.current;
    if (!container || !wordEl) return;

    const st = stateRef.current;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fp = window.matchMedia("(hover: hover) and (pointer: fine)");

    const schedule = () => {
      if (!st.raf) {
        st.raf = window.requestAnimationFrame(frame);
      }
    };

    const syncMedia = () => {
      st.still = rm.matches;
      st.fine = fp.matches;
      schedule();
    };

    const measure = () => {
      const cRect = container.getBoundingClientRect();
      const wRect = wordEl.getBoundingClientRect();
      st.W = cRect.width;
      st.left = cRect.left;
      st.scale = wRect.width / VB_W;
      const wordOffsetX = wRect.left - cRect.left;
      st.centres = WORD.map((_, i) => wordOffsetX + cellMid(i) * st.scale);
      schedule();
    };

    const frame = (now: number) => {
      st.raf = 0;
      const dt = st.last ? Math.min(64, now - st.last) : 16;
      st.last = now;

      const cRect = container.getBoundingClientRect();
      st.left = cRect.left;

      const pointing = (st.over && st.fine) || st.touching;
      const heroVisible = cRect.top > -cRect.height * 0.9 && st.visible;
      const px = !st.still && heroVisible && pointing ? st.px - st.left : null;

      let busy = false;
      let maxH = BASE;

      for (let i = 0; i < WORD.length; i++) {
        st.tg[i] =
          px === null
            ? BASE
            : BASE * (1 + (STRETCH - 1) * pullAt((st.centres[i] ?? 0) - px, st.W));

        st.hs[i] = st.still ? st.tg[i] : approach(st.hs[i], st.tg[i], dt, TAU_LETTER);
        if (Math.abs(st.hs[i] - st.tg[i]) > 0.25) busy = true;
        if (st.hs[i] > maxH) maxH = st.hs[i];

        const d = glyph(WORD[i], cellX(i), CELLS[i], st.hs[i], BASE);
        if (d !== st.lastD[i]) {
          st.lastD[i] = d;
          pathsRef.current[i]?.setAttribute("d", d);
        }
      }

      const sub = subtitleRef?.current;
      if (sub) {
        const extraPx = Math.max(0, (maxH - BASE) * st.scale);
        const shiftY = extraPx > 0.2 ? (extraPx * 0.85).toFixed(1) : "0";
        if (shiftY !== st.lastSubY) {
          st.lastSubY = shiftY;
          sub.style.transform = shiftY === "0" ? "" : `translate3d(0, ${shiftY}px, 0)`;
        }
      }

      if (busy && st.visible) schedule();
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") {
        if (st.touching) {
          st.px = ev.clientX;
          schedule();
        }
        return;
      }
      st.px = ev.clientX;
      st.over = true;
      schedule();
    };

    const onPointerLeave = (ev: PointerEvent) => {
      if (ev.pointerType === "mouse") {
        st.over = false;
        schedule();
      }
    };

    const onPointerDown = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") {
        st.touching = true;
        st.px = ev.clientX;
        schedule();
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") {
        st.touching = false;
        schedule();
      }
    };

    syncMedia();
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(wordEl);

    const io = new IntersectionObserver((entries) => {
      st.visible = entries.some((e) => e.isIntersecting);
      if (st.visible) schedule();
    });
    io.observe(container);

    rm.addEventListener("change", syncMedia);
    fp.addEventListener("change", syncMedia);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    return () => {
      ro.disconnect();
      io.disconnect();
      rm.removeEventListener("change", syncMedia);
      fp.removeEventListener("change", syncMedia);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      if (st.raf) window.cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
  }, [containerRef, subtitleRef]);

  return (
    <div ref={wordRef} className={className}>
      <h1 className="sr-only">FAARREL</h1>
      <svg
        viewBox={`0 0 ${VB_W} ${BASE}`}
        className="block w-full h-auto overflow-visible select-none text-white"
        aria-hidden="true"
      >
        <clipPath id={clipId}>
          <rect x={-20} y={0} width={VB_W + 40} height={Math.ceil(BASE * STRETCH + 60)} />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          {WORD.map((ch, i) => (
            <path
              key={`${ch}-${i}`}
              ref={(el) => {
                pathsRef.current[i] = el;
              }}
              d={glyph(ch, cellX(i), CELLS[i], BASE, BASE)}
              fill="none"
              stroke="currentColor"
              strokeWidth={T}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit={2}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
