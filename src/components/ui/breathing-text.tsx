import React from "react";
import { cn } from "@/lib/utils";

export interface BreathingTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  fromWeight?: number;
  toWeight?: number;
  duration?: number;
  staggerDuration?: number;
}

export const BreathingText = ({
  children,
  fromWeight = 900,
  toWeight = 100,
  duration = 2.0,
  staggerDuration = 0.08,
  className,
  ...props
}: BreathingTextProps) => {
  const letters = String(children).split("");

  return (
    <span
      className={cn(
        "breathing-text-root relative inline-block select-none after:invisible after:h-0 after:block after:content-[attr(data-text)] after:font-black after:pointer-events-none after:overflow-hidden after:select-none",
        className
      )}
      data-text={children}
      {...props}
    >
      <style>{`
        @property --breathe-wght {
          syntax: '<number>';
          inherits: false;
          initial-value: ${fromWeight};
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
          transition: --breathe-wght 0.45s ease-out;
        }

        .breathing-text-root:has(.breathing-letter:hover) .breathing-letter {
          animation: breathe-wave ${duration}s ease-in-out infinite;
          animation-delay: calc(var(--letter-i, 0) * ${staggerDuration}s);
          will-change: font-variation-settings, font-weight;
        }

        @media (prefers-reduced-motion: reduce) {
          .breathing-text-root:has(.breathing-letter:hover) .breathing-letter {
            animation: none;
          }
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
    </span>
  );
};

export default BreathingText;
