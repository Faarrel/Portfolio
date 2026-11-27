"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

export interface GridPatternProps extends ComponentProps<"div"> {
  /**
   * The color of the lit cells and of the light under the pointer, any CSS
   * color. A theme variable follows your theme.
   *
   * @default "var(--foreground)"
   */
  accentColor?: string;
  /**
   * The lines' color, any CSS color. A translucent one sits on any surface.
   *
   * @default "var(--border)"
   */
  color?: string;
  /**
   * Draws the lines as dashes, four to a cell, with one across each crossing.
   *
   * @default false
   */
  dashed?: boolean;
  /**
   * Which edges fade out to the surface: `radial` keeps the middle, the
   * others name the side that fades.
   *
   * @default "none"
   */
  fade?: "none" | "radial" | "top" | "bottom" | "left" | "right" | "vignette";
  /**
   * Whether the lines near the pointer light up. Touch never lights them.
   *
   * @default true
   */
  interactive?: boolean;
  /**
   * The lines' width, in pixels.
   *
   * @default 1
   */
  lineWidth?: number;
  /**
   * Draws every nth line heavier, as on graph paper: 5 gives blocks of five
   * cells. 0 keeps every line the same.
   *
   * @default 0
   */
  majorEvery?: number;
  /**
   * How far the light under the pointer reaches, in pixels.
   *
   * @default 180
   */
  radius?: number;
  /**
   * Another layout of the lit cells, a whole number.
   *
   * @default 0
   */
  seed?: number;
  /**
   * The side of one cell, in pixels.
   *
   * @default 64
   */
  size?: number;
  /**
   * How fast the lit cells come and go: 1 is normal, 0 holds them.
   *
   * @default 1
   */
  speed?: number;
  /**
   * How many cells take turns lighting up, from 0 to 24; a little over
   * half of them show at a time. Each fades in and out, then moves a few
   * cells on.
   *
   * @default 8
   */
  squares?: number;
}

const px = (value: number | undefined) =>
  value === undefined ? undefined : `${value}px`;

/** The step of the heavier lines, when there is one. */
const majorOf = (every: number | undefined) =>
  every !== undefined && every >= 2 ? Math.round(every) : undefined;

/** A number in [0, 1) for cell `i`, spread evenly along `step`'s sequence. */
const spread = (i: number, step: number) =>
  ((0.5 + (i + 1) * step) % 1).toFixed(4);

/**
 * The lit cells: where each sits across the box (the R2 sequence, snapped
 * to the grid in CSS) and where it starts in the cycle.
 */
const squaresOf = (count: number, seed: number) => {
  const total = Math.max(0, Math.min(Math.round(count), 24));
  return Array.from({ length: total }).map((_, key) => ({
    key,
    style: {
      "--grid-pattern-phase": (
        (0.04 + (key * (total + 1)) / (3 * total)) %
        1
      ).toFixed(4),
      "--grid-pattern-u": spread(key + seed * 24, 0.754_877_666_2),
      "--grid-pattern-v": spread(key + seed * 24, 0.569_840_291),
    } as CSSProperties,
  }));
};

const SHADCN_GRID_PATTERN_STYLES = `
.grid-pattern-layer {
  --grid-pattern-mx: mod(round(down, 50cqw - var(--grid-pattern-size, 64px) / 2, 1px) - round(down, var(--grid-pattern-major, 4) / 2, 1) * var(--grid-pattern-size, 64px), calc(var(--grid-pattern-size, 64px) * var(--grid-pattern-major, 4)));
  --grid-pattern-my: mod(round(down, 50cqh - var(--grid-pattern-size, 64px) / 2, 1px) - round(down, var(--grid-pattern-major, 4) / 2, 1) * var(--grid-pattern-size, 64px), calc(var(--grid-pattern-size, 64px) * var(--grid-pattern-major, 4)));
  --grid-pattern-nudge: round(down, calc(var(--grid-pattern-size, 64px) / 8) / 2, 1px);
  --grid-pattern-ox: mod(round(down, 50cqw - var(--grid-pattern-size, 64px) / 2, 1px), var(--grid-pattern-size, 64px));
  --grid-pattern-oy: mod(round(down, 50cqh - var(--grid-pattern-size, 64px) / 2, 1px), var(--grid-pattern-size, 64px));
  container-type: size;
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.grid-pattern-layer[data-fade="bottom"] {
  mask-image: linear-gradient(rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
}

.grid-pattern-layer[data-fade="top"] {
  mask-image: linear-gradient(rgba(0, 0, 0, 0), rgb(0, 0, 0) 55%);
  -webkit-mask-image: linear-gradient(rgba(0, 0, 0, 0), rgb(0, 0, 0) 55%);
}

.grid-pattern-layer[data-fade="left"] {
  mask-image: linear-gradient(270deg, rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(270deg, rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
}

.grid-pattern-layer[data-fade="right"] {
  mask-image: linear-gradient(90deg, rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(90deg, rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
}

.grid-pattern-layer[data-fade="radial"] {
  mask-image: radial-gradient(farthest-side, rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
  -webkit-mask-image: radial-gradient(farthest-side, rgb(0, 0, 0) 45%, rgba(0, 0, 0, 0));
}

.grid-pattern-layer[data-fade="vignette"] {
  mask-image: radial-gradient(ellipse 75% 55% at 50% 25%, black 25%, rgba(0, 0, 0, 0.35) 60%, transparent 88%);
  -webkit-mask-image: radial-gradient(ellipse 75% 55% at 50% 25%, black 25%, rgba(0, 0, 0, 0.35) 60%, transparent 88%);
}

.grid-pattern-lines {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, var(--grid-pattern-color, var(--border)) var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px)),
    linear-gradient(to bottom, var(--grid-pattern-color, var(--border)) var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px));
  background-position: 
    var(--grid-pattern-ox, center) calc(var(--grid-pattern-oy, center) - var(--grid-pattern-nudge, 0px)),
    calc(var(--grid-pattern-ox, center) - var(--grid-pattern-nudge, 0px)) var(--grid-pattern-oy, center);
  background-size: 
    var(--grid-pattern-size, 64px) calc(var(--grid-pattern-size, 64px) / 4),
    calc(var(--grid-pattern-size, 64px) / 4) var(--grid-pattern-size, 64px);
}

[data-major] > .grid-pattern-lines {
  --grid-pattern-heavy: color-mix(in oklab, var(--grid-pattern-accent, var(--foreground)) 20%, var(--grid-pattern-color, var(--border)));
  background-image: 
    linear-gradient(to right, var(--grid-pattern-heavy) var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px)),
    linear-gradient(to bottom, var(--grid-pattern-heavy) var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px)),
    linear-gradient(to right, var(--grid-pattern-color, var(--border)) var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px)),
    linear-gradient(to bottom, var(--grid-pattern-color, var(--border)) var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px));
  background-position: 
    var(--grid-pattern-mx, center) calc(var(--grid-pattern-oy, center) - var(--grid-pattern-nudge, 0px)),
    calc(var(--grid-pattern-ox, center) - var(--grid-pattern-nudge, 0px)) var(--grid-pattern-my, center),
    var(--grid-pattern-ox, center) calc(var(--grid-pattern-oy, center) - var(--grid-pattern-nudge, 0px)),
    calc(var(--grid-pattern-ox, center) - var(--grid-pattern-nudge, 0px)) var(--grid-pattern-oy, center);
  background-size: 
    calc(var(--grid-pattern-size, 64px) * var(--grid-pattern-major, 4)) calc(var(--grid-pattern-size, 64px) / 4),
    calc(var(--grid-pattern-size, 64px) / 4) calc(var(--grid-pattern-size, 64px) * var(--grid-pattern-major, 4)),
    var(--grid-pattern-size, 64px) calc(var(--grid-pattern-size, 64px) / 4),
    calc(var(--grid-pattern-size, 64px) / 4) var(--grid-pattern-size, 64px);
}

.grid-pattern-lit {
  position: absolute;
  inset: 0;
  mask-image: 
    linear-gradient(to right, #000 var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px)),
    linear-gradient(to bottom, #000 var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px));
  mask-position: 
    var(--grid-pattern-ox, center) calc(var(--grid-pattern-oy, center) - var(--grid-pattern-nudge, 0px)),
    calc(var(--grid-pattern-ox, center) - var(--grid-pattern-nudge, 0px)) var(--grid-pattern-oy, center);
  mask-size: 
    var(--grid-pattern-size, 64px) calc(var(--grid-pattern-size, 64px) / 4),
    calc(var(--grid-pattern-size, 64px) / 4) var(--grid-pattern-size, 64px);
  -webkit-mask-image: 
    linear-gradient(to right, #000 var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px)),
    linear-gradient(to bottom, #000 var(--grid-pattern-line-width, 1px), transparent var(--grid-pattern-line-width, 1px));
  -webkit-mask-position: 
    var(--grid-pattern-ox, center) calc(var(--grid-pattern-oy, center) - var(--grid-pattern-nudge, 0px)),
    calc(var(--grid-pattern-ox, center) - var(--grid-pattern-nudge, 0px)) var(--grid-pattern-oy, center);
  -webkit-mask-size: 
    var(--grid-pattern-size, 64px) calc(var(--grid-pattern-size, 64px) / 4),
    calc(var(--grid-pattern-size, 64px) / 4) var(--grid-pattern-size, 64px);
  pointer-events: none;
}

/* Subdued, soft ambient mouse glow: subtle illumination without excessive glare */
.grid-pattern-glow {
  position: absolute;
  top: 0px;
  left: 0px;
  width: calc(var(--grid-pattern-radius, 180px) * 2);
  height: calc(var(--grid-pattern-radius, 180px) * 2);
  background-image: radial-gradient(
    closest-side,
    color-mix(in oklab, var(--grid-pattern-accent, var(--foreground)) 22%, transparent),
    color-mix(in oklab, var(--grid-pattern-accent, var(--foreground)) 7%, transparent) 50%,
    transparent
  );
  opacity: 0;
  transition: opacity .35s ease-out, translate var(--grid-pattern-follow, 0s) cubic-bezier(.22, 1, .36, 1);
  translate: calc(var(--grid-pattern-x, 0px) - var(--grid-pattern-radius, 180px)) calc(var(--grid-pattern-y, 0px) - var(--grid-pattern-radius, 180px));
  will-change: translate;
  pointer-events: none;
}

.grid-pattern-glow[data-pointer] {
  opacity: 1;
}

.grid-pattern-square {
  position: absolute;
  width: calc(var(--grid-pattern-size, 64px) - var(--grid-pattern-line-width, 1px));
  height: calc(var(--grid-pattern-size, 64px) - var(--grid-pattern-line-width, 1px));
  background-color: color-mix(in oklab, var(--grid-pattern-accent, var(--foreground)) 8%, transparent);
  left: calc(var(--grid-pattern-ox, 0px) + round(down, var(--grid-pattern-u, 0.5) * 100cqw - var(--grid-pattern-ox, 0px), var(--grid-pattern-size, 64px)) + var(--grid-pattern-line-width, 1px));
  top: calc(var(--grid-pattern-oy, 0px) + round(down, var(--grid-pattern-v, 0.5) * 100cqh - var(--grid-pattern-oy, 0px), var(--grid-pattern-size, 64px)) + var(--grid-pattern-line-width, 1px));
  opacity: 0;
  pointer-events: none;
}

@keyframes grid-pattern-square {
  0%, 28%, 100% { opacity: 0; translate: 0px; }
  8%, 17%, 41.33%, 50.33%, 74.67%, 83.67% { opacity: calc(.18 + mod(var(--grid-pattern-u, .5) * 4, 1) * .22); }
  33.33%, 61.33% { opacity: 0; translate: calc(var(--grid-pattern-size, 64px) * 3) calc(var(--grid-pattern-size, 64px) * -2); }
  66.67%, 94.67% { opacity: 0; translate: calc(var(--grid-pattern-size, 64px) * -2) calc(var(--grid-pattern-size, 64px) * 3); }
}

.animate-grid-pattern-square {
  animation: grid-pattern-square calc(36s / max(var(--grid-pattern-speed, 1), .001)) ease-in-out calc(var(--grid-pattern-phase, .5) * -36s / max(var(--grid-pattern-speed, 1), .001)) infinite;
}
`;

/**
 * A square grid of thin lines behind its content, drawn in CSS matching https://www.shadcn.io/background/grid-pattern
 */
export const GridPattern = (props: GridPatternProps) => {
  const {
    accentColor = "rgba(255, 255, 255, 0.35)",
    color = "rgba(255, 255, 255, 0.05)",
    dashed = false,
    fade = "vignette",
    interactive = true,
    lineWidth = 1,
    majorEvery = 0,
    radius = 180,
    seed = 0,
    size = 64,
    speed = 1,
    squares = 8,
    onPointerLeave,
    onPointerMove,
    className,
    children,
    ...rest
  } = props;
  const glow = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;
    const node = glow.current;
    if (!node) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;

    const handlePointerMove = (e: globalThis.PointerEvent) => {
      if (e.pointerType === "touch") return;
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          const root = rootRef.current;
          if (!root || !node) return;
          const box = root.getBoundingClientRect();
          node.style.setProperty("--grid-pattern-x", `${pendingX - box.left}px`);
          node.style.setProperty("--grid-pattern-y", `${pendingY - box.top}px`);
          if (!node.dataset.pointer) {
            node.dataset.pointer = "enter";
          }
        });
      }
    };

    const handlePointerLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      node.removeAttribute("data-pointer");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [interactive]);

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate overflow-hidden", className)}
      data-slot="grid-pattern"
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      {...rest}
    >
      <style>{SHADCN_GRID_PATTERN_STYLES}</style>
      <div
        aria-hidden="true"
        className="grid-pattern-layer pointer-events-none absolute inset-0 -z-10 [content-visibility:auto]"
        data-dashed={dashed || undefined}
        data-fade={fade}
        data-major={majorOf(majorEvery)}
        data-slot="grid-pattern-layer"
        style={
          {
            "--grid-pattern-accent": accentColor,
            "--grid-pattern-color": color,
            "--grid-pattern-line-width": px(lineWidth),
            "--grid-pattern-major": majorOf(majorEvery),
            "--grid-pattern-radius": px(radius),
            "--grid-pattern-size": px(size),
            "--grid-pattern-speed": speed,
          } as CSSProperties
        }
      >
        <div
          className="grid-pattern-lines absolute inset-0"
          data-slot="grid-pattern-lines"
        />
        {squaresOf(squares, seed).map((cell) => (
          <div
            className="grid-pattern-square animate-grid-pattern-square motion-reduce:[animation-play-state:paused]"
            data-slot="grid-pattern-square"
            key={cell.key}
            style={cell.style}
          />
        ))}
        {interactive ? (
          <div
            className="grid-pattern-lit absolute inset-0"
            data-slot="grid-pattern-lit"
          >
            <div
              className="grid-pattern-glow"
              data-slot="grid-pattern-glow"
              ref={glow}
            />
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
};
