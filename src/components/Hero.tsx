'use client';

import { motion } from 'framer-motion';
import BreathingText from '@/components/ui/breathing-text';

const DISCIPLINES = [
  'GRAPHIC DESIGN',
  'CHARACTER ANIMATION',
  'DISCORD ARCHITECTURE',
  'FULLSTACK DEVELOPMENT',
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100svh] min-h-[100dvh] flex flex-col justify-between pt-20 sm:pt-36 pb-4 sm:pb-8 px-4 sm:px-8 md:px-12 bg-transparent overflow-hidden">
      <style>{`
        .hero-title-container {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          width: 100%;
        }
        .hero-title-wrapper {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          max-width: 100%;
        }
        .hero-title {
          display: inline-flex !important;
          justify-content: center !important;
          align-items: center !important;
          letter-spacing: -0.065em !important;
          transform-origin: 50% 50% !important;
          text-align: center !important;
          margin-left: auto !important;
          margin-right: auto !important;
          transition: letter-spacing 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
          cursor: pointer !important;
        }
        .hero-title:hover {
          letter-spacing: -0.035em !important;
        }
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .marquee-content {
          display: flex;
          width: max-content;
          animation: marquee-scroll 24s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      {/* Background Soft Lighting Glow behind huge text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] md:w-[900px] h-[250px] sm:h-[350px] bg-white/[0.04] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />

      {/* Top spacer for navbar balance */}
      <div />

      {/* Center Cinematic Giant Typography (Exact FARREL PORTFOLIO Centered Stretch Effect) */}
      <div className="hero-title-container relative z-10 w-full my-auto text-center py-2 sm:py-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-lg md:text-xl font-semibold text-zinc-300 mb-2"
        >
          Hey there, I&apos;m
        </motion.div>

        <div className="hero-title-wrapper flex justify-center items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center items-center w-full max-w-full overflow-hidden"
          >
            <h1 className="hero-title text-[13.5vw] sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] leading-none text-white uppercase select-none my-2 sm:my-4">
              <BreathingText
                fromWeight={100}
                toWeight={900}
                duration={2.0}
                staggerDuration={0.1}
              >
                FAARREL
              </BreathingText>
            </h1>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs sm:text-base md:text-lg text-zinc-200 max-w-2xl mx-auto text-center leading-relaxed font-medium text-pretty mt-2 sm:mt-6 px-2"
        >
          Graphic Designer, Character Animator, Discord Server Architect &amp; Fullstack Developer.
        </motion.p>
      </div>

      {/* Bottom Bar: Infinite Marquee of Talents & Disciplines (English, Full-Width Justified, Crisp & Bold) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full pt-2 sm:pt-6"
      >
        <div className="marquee-container select-none py-1.5 sm:py-2 relative">
          {/* Subtle edge fade overlays: solid compatibility across Android / iOS WebKit without mask-image bugs */}
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
