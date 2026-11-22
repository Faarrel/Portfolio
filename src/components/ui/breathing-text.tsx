"use client";

import React, { ElementType, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface BreathingTextProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
  as?: ElementType;
  fromWeight?: number;
  toWeight?: number;
  duration?: number;
  staggerDuration?: number;
}

export const BreathingText = ({
  children,
  as = "span",
  fromWeight = 100,
  toWeight = 900,
  duration = 2.0,
  staggerDuration = 0.1,
  className,
  ...props
}: BreathingTextProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const letters = String(children).split("");
  const ElementTag = as;

  return (
    <ElementTag
      ref={containerRef as any}
      className={cn(
        "breathing-text-root relative inline-block select-none after:invisible after:h-0 after:block after:content-[attr(data-text)] after:font-black after:pointer-events-none after:overflow-hidden after:select-none",
        !isInView && "breathing-text-paused",
        className
      )}
      data-text={children}
      {...props}
    >
      <style>{`
        @property --breathe-wght {
          syntax: '<number>';
          inherits: false;
          initial-value: 100;
        }

        @keyframes breathe-wave {
          0%, 100% {
            --breathe-wght: ${fromWeight};
            font-weight: ${fromWeight};
          }
          50% {
            --breathe-wght: ${toWeight};
            font-weight: ${toWeight};
          }
        }

        .breathing-letter {
          display: inline-block;
          white-space: pre;
          --breathe-wght: ${fromWeight};
          font-variation-settings: 'wght' var(--breathe-wght);
          font-weight: var(--breathe-wght);
          animation: breathe-wave ${duration}s ease-in-out infinite;
          animation-delay: calc(var(--letter-i, 0) * ${staggerDuration}s);
          will-change: font-variation-settings, font-weight;
        }

        .breathing-text-paused .breathing-letter {
          animation-play-state: paused !important;
        }
      `}</style>

      {letters.map((letter: string, i: number) => (
        <span
          key={i}
          className="breathing-letter"
          aria-hidden="true"
          style={{ "--letter-i": i } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </ElementTag>
  );
};

export default BreathingText;
