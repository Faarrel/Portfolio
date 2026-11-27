'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import {
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  OpenInNewIcon,
  GithubIcon,
  MailIcon,
  FiverrIcon,
  DiscordIcon,
  SearchIcon,
} from '@/components/ui/material-symbols';

export interface ProjectModalItem {
  title: string;
  categoryLabel?: string;
  description: string;
  year?: string;
  role?: string;
  tools?: string[];
  metrics?: string;
  details?: string[];
  externalUrl?: string;
  externalLabel?: string;
  externalType?: 'fiverr' | 'discord' | 'github' | 'external';
  previewUrl?: string;
  gallery?: string[];
  clientReview?: {
    author: string;
    rating: number;
    comment: string;
  };
}

interface ProjectModalProps {
  item: ProjectModalItem | null;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const isMediaVideo = (url?: string | null): boolean => {
  if (!url) return false;
  return url.includes('/video/upload/') || url.endsWith('.mp4') || url.endsWith('.webm');
};

const getVideoPoster = (url: string): string => {
  if (!isMediaVideo(url)) return url;
  const clean = url.replace(/\.(mp4|webm)$/i, '');
  if (clean.includes('/video/upload/t_fiverr_hd/')) {
    return clean.replace('/video/upload/t_fiverr_hd/', '/video/upload/so_0/') + '.jpg';
  }
  if (clean.includes('/video/upload/')) {
    return clean.replace('/video/upload/', '/video/upload/so_0/') + '.jpg';
  }
  return clean + '.jpg';
};

const getVideoSource = (url: string): string => {
  if (!isMediaVideo(url)) return url;
  if (!url.endsWith('.mp4') && !url.endsWith('.webm')) {
    return url + '.mp4';
  }
  return url;
};

const getStaticThumbnail = (url: string): string => {
  if (!url) return '';
  if (isMediaVideo(url)) {
    return getVideoPoster(url);
  }
  if (url.includes('cloudinary.com/image/upload/')) {
    let u = url.replace(/\/image\/upload\/[^/]+\//, '/image/upload/pg_1,w_480,c_limit,q_auto,f_jpg/');
    u = u.replace(/\.gif$/i, '.jpg');
    return u;
  }
  return url;
};

export default function ProjectModal({ item, onClose }: ProjectModalProps) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const titleId = useId();

  const galleryList =
    item?.gallery && item.gallery.length > 0
      ? item.gallery
      : item?.previewUrl
      ? [item.previewUrl]
      : [];

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);

  // Dedicated Lenis smooth scroll inside modal body matching main page curve
  useEffect(() => {
    if (!item || !contentRef.current || !innerRef.current) return;

    contentRef.current.scrollTop = 0;

    const modalLenis = new Lenis({
      wrapper: contentRef.current,
      content: innerRef.current,
      eventsTarget: contentRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    function raf(time: number) {
      modalLenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      modalLenis.destroy();
    };
  }, [item]);

  // Keep active lightbox thumbnail centered in strip
  useEffect(() => {
    if (activeLightboxIndex !== null && thumbnailRefs.current[activeLightboxIndex]) {
      thumbnailRefs.current[activeLightboxIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeLightboxIndex]);

  // Lock background scroll and restore focus cleanly on close
  useEffect(() => {
    if (!item) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.__lenis?.stop();

    const focusTimer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(focusTimer);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.__lenis?.start();
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [item]);

  // Focus active lightbox close button when lightbox opens
  useEffect(() => {
    if (activeLightboxIndex === null) return;
    const frame = requestAnimationFrame(() => {
      lightboxCloseRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [activeLightboxIndex]);

  // Keyboard navigation (Escape, ArrowLeft/Right, and Tab focus trap)
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeLightboxIndex !== null) {
          setActiveLightboxIndex(null);
        } else {
          onClose();
        }
        return;
      }

      if (activeLightboxIndex !== null && galleryList.length > 1) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setActiveLightboxIndex((prev) =>
            prev === null ? 0 : (prev - 1 + galleryList.length) % galleryList.length
          );
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setActiveLightboxIndex((prev) =>
            prev === null ? 0 : (prev + 1) % galleryList.length
          );
          return;
        }
      }

      if (e.key === 'Tab') {
        const activeContainer =
          activeLightboxIndex !== null ? lightboxRef.current : dialogRef.current;
        if (!activeContainer) return;

        const focusable = Array.from(
          activeContainer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;

        if (e.shiftKey) {
          if (current === first || !activeContainer.contains(current)) {
            e.preventDefault();
            last.focus();
          }
        } else if (current === last || !activeContainer.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, activeLightboxIndex, galleryList.length]);

  const metaLine = [item?.categoryLabel, item?.role, item?.year, item?.metrics]
    .filter(Boolean)
    .join(' · ');

  const visibleGallery = galleryList.length > 3 ? galleryList.slice(0, 3) : galleryList;
  const remainingCount = galleryList.length > 3 ? galleryList.length - 3 : 0;

  return (
    <AnimatePresence>
      {item && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[#09090b]/85 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Dialog Card matching BentoSection surfaces & typography */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 14 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[88dvh] bg-[var(--card)] border border-[var(--border)] rounded-[24px] sm:rounded-[28px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)] z-10 flex flex-col overflow-hidden my-auto"
          >
            {/* Editorial Header (No uppercase eyebrow above title) */}
            <div className="shrink-0 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-[var(--border)] flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug text-balance"
                >
                  {item.title}
                </h2>
                {metaLine && (
                  <p className="text-xs sm:text-[13px] text-[var(--muted-foreground)] font-medium mt-1.5 leading-relaxed">
                    {metaLine}
                  </p>
                )}
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="size-11 -mr-1.5 -mt-1.5 rounded-full bg-[#202024] hover:bg-[#28282e] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <CloseIcon className="size-4.5" />
              </button>
            </div>

            {/* Scrollable Body (Lenis smooth scroll, hidden scrollbar) */}
            <div
              ref={contentRef}
              data-lenis-prevent
              tabIndex={0}
              className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-7 py-5 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white/40 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div ref={innerRef} className="space-y-5">
                {/* Summary */}
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal max-w-[65ch] text-pretty">
                  {item.description}
                </p>

                {/* Media Showcase: Sized cleanly so tiles & review stay balanced */}
                {galleryList.length > 0 && (
                  <div>
                    {galleryList.length === 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveLightboxIndex(0)}
                        aria-label={`View ${item.title} preview`}
                        className="relative w-full aspect-[16/9] max-h-56 rounded-2xl overflow-hidden bg-[#121214] border border-[var(--border)] group cursor-pointer hover:border-zinc-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getStaticThumbnail(galleryList[0])}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          loading="lazy"
                        />
                        {isMediaVideo(galleryList[0]) && (
                          <span className="absolute bottom-3 right-3 size-8 rounded-full bg-[#121212]/90 border border-white/20 flex items-center justify-center text-white pointer-events-none">
                            <svg className="size-3.5 fill-current ml-0.5" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="size-11 rounded-full bg-[#121212]/90 border border-white/20 flex items-center justify-center text-white">
                            <SearchIcon className="size-5" />
                          </span>
                        </span>
                      </button>
                    ) : (
                      <div
                        className={`grid gap-2 sm:gap-3 w-full ${
                          visibleGallery.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                        }`}
                      >
                        {visibleGallery.map((mediaUrl, idx) => {
                          const isLastOverflowTile =
                            idx === visibleGallery.length - 1 && remainingCount > 0;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveLightboxIndex(idx)}
                              aria-label={
                                isLastOverflowTile
                                  ? `View all ${galleryList.length} media items`
                                  : `View ${item.title} preview ${idx + 1}`
                              }
                              className="relative aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[#121214] border border-[var(--border)] group cursor-pointer hover:border-zinc-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={getStaticThumbnail(mediaUrl)}
                                alt={`${item.title} preview ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                loading="lazy"
                              />

                              {isMediaVideo(mediaUrl) && !isLastOverflowTile && (
                                <span className="absolute bottom-2 right-2 size-7 rounded-full bg-[#121212]/90 border border-white/20 flex items-center justify-center text-white pointer-events-none">
                                  <svg className="size-3.5 fill-current ml-0.5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </span>
                              )}

                              {isLastOverflowTile ? (
                                <span className="absolute inset-0 bg-[#09090b]/75 group-hover:bg-[#09090b]/60 transition-colors flex flex-col items-center justify-center text-white px-1">
                                  <span className="font-display text-lg sm:text-2xl font-bold tracking-tight">
                                    +{remainingCount}
                                  </span>
                                  <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-200 tracking-wide mt-0.5">
                                    View Gallery
                                  </span>
                                </span>
                              ) : (
                                <span className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="size-9 sm:size-10 rounded-full bg-[#121212]/90 border border-white/20 flex items-center justify-center text-white">
                                    <SearchIcon className="size-4" />
                                  </span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Highlights & Tools (matching i'm faarrel editorial list rhythm) */}
                {((item.details && item.details.length > 0) ||
                  (item.tools && item.tools.length > 0)) && (
                  <div className="border-t border-[var(--border)] pt-4 space-y-3">
                    {item.details && item.details.length > 0 && (
                      <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-200 leading-relaxed">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span
                              className="size-1.5 rounded-full bg-zinc-400 shrink-0 mt-2"
                              aria-hidden="true"
                            />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.tools && item.tools.length > 0 && (
                      <p className="text-xs font-mono text-[var(--muted-foreground)] leading-relaxed">
                        {item.tools.join(' · ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Verified Client Review (editorial divider, no nested card box) */}
                {item.clientReview && (
                  <div className="border-t border-[var(--border)] pt-4 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-100 min-w-0">
                        <span className="truncate">Verified Client Review</span>
                        <span className="text-[var(--muted-foreground)]" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[var(--muted-foreground)] font-mono truncate">
                          @{item.clientReview.author}
                        </span>
                      </div>
                      <span className="text-white font-bold tabular-nums shrink-0">
                        ★ {item.clientReview.rating.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-zinc-200 italic leading-relaxed">
                      &ldquo;{item.clientReview.comment}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Action Bar matching ContactSection pill buttons */}
            <div className="shrink-0 bg-[var(--card)] px-4 sm:px-7 py-3.5 sm:py-4 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-3 w-full">
                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-3 sm:px-5 rounded-full bg-[#18181b] border border-[var(--border)] hover:bg-[#202024] text-zinc-100 text-[11px] sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {item.externalType === 'fiverr' && <FiverrIcon className="size-3.5 sm:size-4 shrink-0" />}
                    {item.externalType === 'discord' && <DiscordIcon className="size-3.5 sm:size-4 shrink-0" />}
                    {item.externalType === 'github' && <GithubIcon className="size-3.5 sm:size-4 shrink-0" />}
                    <span className="truncate">
                      {item.externalLabel ||
                        (item.externalType === 'fiverr'
                          ? 'View on Fiverr'
                          : item.externalType === 'discord'
                          ? 'Contact on Discord'
                          : item.externalType === 'github'
                          ? 'View on GitHub'
                          : 'View Project')}
                    </span>
                    <OpenInNewIcon className="size-3 sm:size-3.5 text-[var(--muted-foreground)] shrink-0" />
                  </a>
                )}

                <a
                  href="#contact"
                  onClick={onClose}
                  className={`h-11 px-3 sm:px-6 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    !item.externalUrl ? 'col-span-2' : ''
                  }`}
                >
                  <MailIcon className="size-3.5 sm:size-4 shrink-0 text-zinc-950" />
                  <span>Discuss Project</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Fullscreen Media Lightbox */}
          <AnimatePresence>
            {activeLightboxIndex !== null && galleryList.length > 0 && (
              <motion.div
                ref={lightboxRef}
                role="dialog"
                aria-modal="true"
                aria-label={`${item.title} media gallery`}
                key="lightbox-container"
                data-lenis-prevent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[120] flex flex-col justify-between p-3 sm:p-6 overflow-hidden select-none"
              >
                {/* Solid Obsidian Scrim */}
                <div
                  onClick={() => setActiveLightboxIndex(null)}
                  aria-hidden="true"
                  className="fixed inset-0 bg-[#09090b]/95 cursor-pointer"
                />

                {/* Top Control Bar */}
                <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto py-1.5 px-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-medium tabular-nums text-zinc-200 bg-[#202024] border border-[var(--border)] px-3 py-1.5 rounded-full shrink-0">
                      {activeLightboxIndex + 1} / {galleryList.length}
                    </span>
                    <span className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-zinc-200 truncate max-w-md">
                      {item.title}
                    </span>
                  </div>

                  <button
                    ref={lightboxCloseRef}
                    type="button"
                    onClick={() => setActiveLightboxIndex(null)}
                    aria-label="Close preview"
                    className="size-11 rounded-full bg-[#202024] hover:bg-[#28282e] border border-[var(--border)] flex items-center justify-center text-zinc-200 hover:text-white transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <CloseIcon className="size-4.5" />
                  </button>
                </div>

                {/* Center Media Stage */}
                <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 my-auto px-2 sm:px-14">
                  {galleryList.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveLightboxIndex((prev) =>
                          prev === null ? 0 : (prev - 1 + galleryList.length) % galleryList.length
                        )
                      }
                      aria-label="Previous media"
                      className="absolute left-1 sm:left-4 z-20 size-11 rounded-full bg-[#161618] hover:bg-[#202024] border border-[var(--border)] text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <ChevronLeftIcon className="size-5" />
                    </button>
                  )}

                  <motion.div
                    key={activeLightboxIndex}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-w-full max-h-[66dvh] sm:max-h-[72dvh] flex items-center justify-center"
                  >
                    {isMediaVideo(galleryList[activeLightboxIndex]) ? (
                      <video
                        src={getVideoSource(galleryList[activeLightboxIndex])}
                        poster={getVideoPoster(galleryList[activeLightboxIndex])}
                        autoPlay
                        loop
                        controls
                        playsInline
                        className="max-w-full max-h-[66dvh] sm:max-h-[72dvh] object-contain rounded-2xl border border-[var(--border)] bg-black"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={galleryList[activeLightboxIndex]}
                        alt={`${item.title} preview ${activeLightboxIndex + 1}`}
                        className="max-w-full max-h-[66dvh] sm:max-h-[72dvh] object-contain rounded-2xl border border-[var(--border)] bg-[#121214]"
                      />
                    )}
                  </motion.div>

                  {galleryList.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveLightboxIndex((prev) =>
                          prev === null ? 0 : (prev + 1) % galleryList.length
                        )
                      }
                      aria-label="Next media"
                      className="absolute right-1 sm:right-4 z-20 size-11 rounded-full bg-[#161618] hover:bg-[#202024] border border-[var(--border)] text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <ChevronRightIcon className="size-5" />
                    </button>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {galleryList.length > 1 && (
                  <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-2 pb-1.5 flex justify-center">
                    <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-2 bg-[#161618] border border-[var(--border)] rounded-2xl max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {galleryList.map((thumbUrl, idx) => {
                        const isActive = idx === activeLightboxIndex;
                        const poster = getStaticThumbnail(thumbUrl);
                        return (
                          <button
                            key={idx}
                            ref={(el) => {
                              thumbnailRefs.current[idx] = el;
                            }}
                            type="button"
                            onClick={() => setActiveLightboxIndex(idx)}
                            aria-label={`Go to preview ${idx + 1}`}
                            aria-current={isActive ? 'true' : undefined}
                            className={`size-11 sm:size-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                              isActive
                                ? 'border-white scale-105 opacity-100'
                                : 'border-transparent opacity-55 hover:opacity-90'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={poster}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
