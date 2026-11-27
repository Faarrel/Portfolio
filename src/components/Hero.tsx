'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  WORD,
  T,
  CELLS,
  VB_W,
  TAU_LETTER,
  TAU_LOOK,
  SPIN,
  baseFor,
  vbH,
  cellX,
  cellMid,
  approach,
  lookAt,
  stretchTargets,
  glyph,
  f,
} from '@/components/ui/stretch-wordmark';

const DISCIPLINES = [
  'GRAPHIC DESIGN',
  'CHARACTER ANIMATION',
  'DISCORD ARCHITECTURE',
  'FULLSTACK DEVELOPMENT',
];

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const lookRef = useRef<HTMLDivElement | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);
  const clipId = 'faarrel-clip-' + useId().replace(/[^a-zA-Z0-9]/g, '');

  const [base, setBase] = useState(172);

  const stateRef = useRef({
    W: 0,
    H: 0,
    base: 172,
    wordX: 0,
    wordW: 1,
    centres: WORD.map(() => 0),
    hs: WORD.map(() => 172),
    tg: WORD.map(() => 172),
    fine: false,
    still: false,
    top: 0,
    left: 0,
    last: 0,
    px: -1,
    py: -1,
    over: false,
    touching: false,
    rx: 0,
    ry: 0,
    spin: 0,
    visible: true,
    raf: 0,
    lastD: WORD.map(() => ''),
    lastLook: '',
    lastSpin: '',
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const st = stateRef.current;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fp = window.matchMedia('(hover: hover) and (pointer: fine)');

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
      st.W = root.offsetWidth;
      st.H = root.offsetHeight;
      const w = wordRef.current;
      if (w) {
        st.wordX = w.offsetLeft;
        st.wordW = w.offsetWidth;
      }
      const scale = st.wordW / VB_W;
      st.centres = WORD.map((_, i) => st.wordX + cellMid(i) * scale);
      const b = baseFor(st.H, scale);
      if (b !== st.base) {
        st.base = b;
        st.hs = WORD.map(() => b);
        st.tg = WORD.map(() => b);
        setBase(b);
      }
      schedule();
    };

    const frame = (now: number) => {
      st.raf = 0;
      if (!st.H) return;
      const dt = st.last ? Math.min(64, now - st.last) : 16;
      st.last = now;

      const rect = root.getBoundingClientRect();
      st.left = rect.left;
      st.top = rect.top;

      const heroUp = st.top > -st.H * 0.98;
      const pointing = (st.over && st.fine) || st.touching;
      const px = !st.still && heroUp && pointing ? st.px - st.left : null;

      let busy = false;
      stretchTargets(px, st.centres, st.W, st.base, st.tg);

      for (let i = 0; i < WORD.length; i++) {
        st.hs[i] = st.still ? st.tg[i] : approach(st.hs[i], st.tg[i], dt, TAU_LETTER);
        if (Math.abs(st.hs[i] - st.tg[i]) > 0.3) busy = true;

        const d = glyph(WORD[i], cellX(i), CELLS[i], st.hs[i], st.base);
        if (d !== st.lastD[i]) {
          st.lastD[i] = d;
          pathsRef.current[i]?.setAttribute('d', d);
        }
      }

      if (!st.still) {
        const look =
          pointing && heroUp && st.W > 0 && st.H > 0
            ? lookAt((st.px - st.left - st.W / 2) / (st.W / 2), (st.py - st.top - st.H / 2) / (st.H / 2))
            : { rx: 0, ry: 0 };
        st.rx = approach(st.rx, look.rx, dt, TAU_LOOK);
        st.ry = approach(st.ry, look.ry, dt, TAU_LOOK);
        st.spin = (st.spin + (SPIN * dt) / 1000) % 360;
        busy = true;
      }

      const lookTransform = `rotateX(${f(st.rx)}deg) rotateY(${f(st.ry)}deg)`;
      if (lookTransform !== st.lastLook && lookRef.current) {
        st.lastLook = lookTransform;
        lookRef.current.style.transform = lookTransform;
      }

      const spinTransform = `rotateY(${f(st.spin)}deg)`;
      if (spinTransform !== st.lastSpin && spinRef.current) {
        st.lastSpin = spinTransform;
        spinRef.current.style.transform = spinTransform;
      }

      if (busy && st.visible) schedule();
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') {
        if (st.touching) {
          st.px = ev.clientX;
          st.py = ev.clientY;
          schedule();
        }
        return;
      }
      st.px = ev.clientX;
      st.py = ev.clientY;
      st.over = true;
      schedule();
    };

    const onPointerLeave = (ev: PointerEvent) => {
      if (ev.pointerType === 'mouse') {
        st.over = false;
        schedule();
      }
    };

    const onPointerDown = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') {
        st.touching = true;
        st.px = ev.clientX;
        st.py = ev.clientY;
        schedule();
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') {
        st.touching = false;
        schedule();
      }
    };

    const onScroll = () => schedule();

    syncMedia();
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(root);

    const io = new IntersectionObserver((entries) => {
      st.visible = entries.some((e) => e.isIntersecting);
      if (st.visible) schedule();
    });
    io.observe(root);

    rm.addEventListener('change', syncMedia);
    fp.addEventListener('change', syncMedia);
    window.addEventListener('scroll', onScroll, { passive: true });
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerleave', onPointerLeave);
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);

    return () => {
      ro.disconnect();
      io.disconnect();
      rm.removeEventListener('change', syncMedia);
      fp.removeEventListener('change', syncMedia);
      window.removeEventListener('scroll', onScroll);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerUp);
      if (st.raf) window.cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
  }, []);

  const vbh = vbH(base);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative min-h-[100svh] min-h-[100dvh] bg-transparent overflow-hidden select-none"
    >
      {/* Background Soft Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] md:w-[900px] h-[250px] sm:h-[350px] bg-white/[0.04] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />

      {/* Full-Width Top-Anchored Interactive Stretch Wordmark (BUNKUM structure) */}
      <div
        ref={wordRef}
        className="absolute left-[10px] right-[10px] sm:left-[18px] sm:right-[18px] top-[86px] sm:top-[clamp(86px,10vh,104px)] z-10 pointer-events-none"
      >
        <h1 className="sr-only">FAARREL</h1>
        <svg
          viewBox={`0 0 ${VB_W} ${vbh}`}
          className="block w-full h-auto overflow-visible text-white"
          aria-hidden="true"
        >
          <clipPath id={clipId}>
            <rect x={-20} y={0} width={VB_W + 40} height={vbh + 400} />
          </clipPath>
          <g clipPath={`url(#${clipId})`}>
            {WORD.map((ch, i) => (
              <path
                key={`${ch}-${i}`}
                ref={(el) => {
                  pathsRef.current[i] = el;
                }}
                d={glyph(ch, cellX(i), CELLS[i], base, base)}
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

      {/* Centered 3D Monochrome Box looking toward pointer */}
      <div className="hero-box" aria-hidden="true">
        <div className="hero-box-pose">
          <div ref={lookRef} className="hero-box-look">
            <div ref={spinRef} className="hero-box-spin">
              <div className="hero-box-body">
                {/* Front Face */}
                <div className="hero-box-face hero-box-f0 hero-box-fz bg-[#141418] flex flex-col justify-between p-2.5 sm:p-3.5 text-white">
                  <div className="flex items-center justify-between text-[7px] sm:text-[9px] font-mono tracking-widest text-zinc-400">
                    <span>01</span>
                    <span>IDN</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 my-auto">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg border border-white/15 bg-white/[0.03] flex items-center justify-center p-2">
                      <img src="/logo.webp" alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-sans font-extrabold text-[10px] sm:text-xs tracking-[0.22em] text-white">
                      FAARREL
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[6px] sm:text-[8px] font-mono tracking-widest text-zinc-400 border-t border-white/15 pt-1.5">
                    <span>STUDIO</span>
                    <span>2026</span>
                  </div>
                </div>

                {/* Back Face */}
                <div className="hero-box-face hero-box-f1 hero-box-fz bg-[#111114] flex flex-col justify-between p-2.5 sm:p-3.5 text-white">
                  <div className="flex items-center justify-between text-[7px] sm:text-[9px] font-mono tracking-widest text-zinc-400">
                    <span>DEV</span>
                    <span>ART</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 my-auto">
                    <img src="/logo.webp" alt="" className="w-9 h-9 sm:w-12 sm:h-12 object-contain opacity-90" />
                    <span className="text-[7px] sm:text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-300 text-center">
                      VISUAL &amp; CODE
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[6px] sm:text-[8px] font-mono tracking-widest text-zinc-500 border-t border-white/15 pt-1.5">
                    <span>4.9★</span>
                    <span>300+</span>
                  </div>
                </div>

                {/* Right Spine */}
                <div className="hero-box-face hero-box-f2 hero-box-fx bg-[#1a1a20] flex flex-col items-center justify-between py-3 px-1 text-zinc-300">
                  <span className="text-[6px] sm:text-[8px] font-mono tracking-widest">✦</span>
                  <span
                    className="text-[7px] sm:text-[9px] font-mono uppercase tracking-[0.26em] whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    FAARREL STUDIO
                  </span>
                  <span className="text-[6px] sm:text-[8px] font-mono tracking-widest">02</span>
                </div>

                {/* Left Spine */}
                <div className="hero-box-face hero-box-f3 hero-box-fx bg-[#101014] flex flex-col items-center justify-between py-3 px-1 text-zinc-300">
                  <span className="text-[6px] sm:text-[8px] font-mono tracking-widest">03</span>
                  <span
                    className="text-[7px] sm:text-[9px] font-mono uppercase tracking-[0.26em] whitespace-nowrap rotate-180"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    DESIGN · MOTION · DEV
                  </span>
                  <span className="text-[6px] sm:text-[8px] font-mono tracking-widest">✦</span>
                </div>

                {/* Top Cap */}
                <div className="hero-box-face hero-box-f4 hero-box-fy bg-[#1e1e25] flex items-center justify-center text-zinc-400">
                  <span className="text-[10px] sm:text-xs font-mono">+</span>
                </div>

                {/* Bottom Cap */}
                <div className="hero-box-face hero-box-f5 hero-box-fy bg-[#0c0c0f] flex items-center justify-center text-zinc-500">
                  <span className="text-[10px] sm:text-xs font-mono">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Infinite Marquee */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 z-30 px-4 sm:px-8 md:px-12 pb-4 sm:pb-7 pointer-events-none"
      >
        <div className="marquee-container py-1.5 sm:py-2 relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#121212] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#121212] to-transparent z-10" />

          <div className="marquee-content flex items-center">
            {[0, 1, 2, 3, 4, 5].flatMap((group) =>
              DISCIPLINES.map((item, idx) => (
                <span
                  key={`${group}-${idx}`}
                  className="inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-zinc-100 shrink-0"
                >
                  <span>{item}</span>
                  <span className="mx-3 sm:mx-5 text-zinc-400 text-xs select-none">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
