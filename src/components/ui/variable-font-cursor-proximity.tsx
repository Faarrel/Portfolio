"use client";

import React, { useEffect, useMemo, useRef, type RefObject } from "react";
import { cn } from "@/lib/utils";

type FalloffType = "linear" | "exponential" | "gaussian";

export interface VariableFontCursorProximityProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: FalloffType;
}

interface ParsedAxis {
  axis: string;
  fromValue: number;
  toValue: number;
}

function parseFontVariationSettings(settingsStr: string): Map<string, number> {
  const result = new Map<string, number>();
  const parts = settingsStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    const match = trimmed.match(/^['"]([a-zA-Z0-9]{4})['"]\s+(-?\d+(?:\.\d+)?)$/);
    if (match) {
      result.set(match[1], parseFloat(match[2]));
    }
  }
  return result;
}

function calculateFalloff(
  distance: number,
  radius: number,
  falloff: FalloffType
): number {
  if (distance >= radius) return 0;
  const normalized = distance / radius;
  switch (falloff) {
    case "exponential":
      return Math.pow(1 - normalized, 2);
    case "gaussian":
      return Math.exp(-Math.pow(distance / (radius / 2.5), 2) / 2);
    case "linear":
    default:
      return 1 - normalized;
  }
}

export const VariableFontCursorProximity = ({
  children,
  fromFontVariationSettings,
  toFontVariationSettings,
  containerRef,
  radius = 200,
  falloff = "linear",
  className,
  style,
  ...props
}: VariableFontCursorProximityProps) => {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const parsedSettings = useMemo<ParsedAxis[]>(() => {
    const fromMap = parseFontVariationSettings(fromFontVariationSettings);
    const toMap = parseFontVariationSettings(toFontVariationSettings);
    const axes: ParsedAxis[] = [];
    fromMap.forEach((fromValue, axis) => {
      axes.push({
        axis,
        fromValue,
        toValue: toMap.get(axis) ?? fromValue,
      });
    });
    return axes;
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const defaultWeight = useMemo(() => {
    const wght = parsedSettings.find((s) => s.axis === "wght");
    return wght ? wght.fromValue : undefined;
  }, [parsedSettings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;

    const applyProximity = () => {
      rafId = 0;
      const letters = letterRefs.current;

      // Batch DOM reads before DOM writes to prevent layout thrashing
      const distances = letters.map((el) => {
        if (!el) return Infinity;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return Math.hypot(pointerX - cx, pointerY - cy);
      });

      letters.forEach((el, idx) => {
        if (!el) return;
        const factor = calculateFalloff(distances[idx], radius, falloff);
        let weightValue: number | undefined;
        const variationParts: string[] = [];

        for (const { axis, fromValue, toValue } of parsedSettings) {
          const val = Math.round((fromValue + (toValue - fromValue) * factor) * 10) / 10;
          variationParts.push(`'${axis}' ${val}`);
          if (axis === "wght") {
            weightValue = Math.round(val);
          }
        }

        el.style.transition = "none";
        el.style.fontVariationSettings = variationParts.join(", ");
        if (weightValue !== undefined) {
          el.style.fontWeight = String(weightValue);
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(applyProximity);
      }
    };

    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      letterRefs.current.forEach((el) => {
        if (!el) return;
        el.style.transition = "font-variation-settings 0.35s ease-out, font-weight 0.35s ease-out";
        el.style.fontVariationSettings = fromFontVariationSettings;
        if (defaultWeight !== undefined) {
          el.style.fontWeight = String(defaultWeight);
        }
      });
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    containerRef,
    defaultWeight,
    falloff,
    fromFontVariationSettings,
    parsedSettings,
    radius,
  ]);

  const letters = String(children).split("");

  return (
    <span
      className={cn("inline-block select-none", className)}
      style={{
        fontVariationSettings: fromFontVariationSettings,
        ...(defaultWeight !== undefined ? { fontWeight: defaultWeight } : {}),
        ...style,
      }}
      {...props}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            letterRefs.current[index] = el;
          }}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          style={{
            fontVariationSettings: fromFontVariationSettings,
            ...(defaultWeight !== undefined ? { fontWeight: defaultWeight } : {}),
          }}
        >
          {letter}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  );
};

export default VariableFontCursorProximity;
