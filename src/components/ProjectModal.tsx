'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  githubUrl?: string;
  externalUrl?: string;
  externalLabel?: string;
  externalType?: 'fiverr' | 'discord' | 'github' | 'external';
  previewUrl?: string;
  gallery?: string[];
  clientReview?: {
    author: string;
    rating: number;
    comment: string;
    orderType?: string;
  };
}

interface ProjectModalProps {
  item: ProjectModalItem | null;
  onClose: () => void;
}

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

export default function ProjectModal({ item, onClose }: ProjectModalProps) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const galleryList = item?.gallery && item.gallery.length > 0
    ? item.gallery
    : item?.previewUrl
    ? [item.previewUrl]
    : [];

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeLightboxIndex !== null) {
          setActiveLightboxIndex(null);
        } else {
          onClose();
        }
      } else if (activeLightboxIndex !== null && galleryList.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveLightboxIndex((prev) =>
            prev === null ? 0 : (prev - 1 + galleryList.length) % galleryList.length
          );
        } else if (e.key === 'ArrowRight') {
          setActiveLightboxIndex((prev) =>
            prev === null ? 0 : (prev + 1) % galleryList.length
          );
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose, activeLightboxIndex, galleryList.length]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
          {/* Backdrop with frosted dark blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[88vh] max-h-[88dvh] bg-[#161618] border border-[#27272a] rounded-[22px] sm:rounded-[24px] shadow-2xl z-10 flex flex-col overflow-hidden my-auto"
          >
            {/* Header: Clean, refined top bar without clunky badges */}
            <div className="shrink-0 bg-[#161618] px-4 sm:px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {item.categoryLabel || 'Showcase'}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="size-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* Scrollable Content Area: strictly constrained by min-h-0 so header/footer are never pushed */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
              {/* Title & Metadata */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 font-medium mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  {[item.role, item.year, item.metrics].filter(Boolean).join(' · ')}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {item.description}
              </p>

              {/* Key Highlights */}
              {item.details && item.details.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                    Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="size-1.5 rounded-full bg-zinc-400 shrink-0 mt-1.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools / Tech Stack */}
              {item.tools && item.tools.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs text-zinc-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                    Tools:
                  </span>
                  {item.tools.map((tool, idx) => (
                    <span key={tool} className="text-zinc-300 font-medium text-xs">
                      {tool}{idx < item.tools!.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              )}

              {/* Discord-style Media Attachment Grid (Symmetrical, square, precision tiles) */}
              {galleryList.length > 0 && (
                <div className="pt-1.5">
                  {galleryList.length === 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveLightboxIndex(0)}
                      aria-label={`View ${item.title} preview`}
                      className="relative w-full aspect-[16/9] max-h-60 rounded-2xl overflow-hidden bg-black/50 border border-white/10 group cursor-pointer hover:border-white/30 transition-all shadow-sm"
                    >
                      {isMediaVideo(galleryList[0]) ? (
                        <video
                          src={getVideoSource(galleryList[0])}
                          poster={getVideoPoster(galleryList[0])}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={galleryList[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <div className="size-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                          <SearchIcon className="size-5" />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                      {/* Left Thumbnail (Item 0) - Square Aspect Ratio */}
                      <button
                        type="button"
                        onClick={() => setActiveLightboxIndex(0)}
                        aria-label={`View ${item.title} preview 1`}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer hover:border-white/30 transition-all shadow-sm ring-1 ring-white/5"
                      >
                        {isMediaVideo(galleryList[0]) ? (
                          <video
                            src={getVideoSource(galleryList[0])}
                            poster={getVideoPoster(galleryList[0])}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={galleryList[0]}
                            alt={`${item.title} preview 1`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="eager"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <div className="size-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                            <SearchIcon className="size-5" />
                          </div>
                        </div>
                      </button>

                      {/* Right Thumbnail (Item 1) - Square Aspect Ratio with Balanced Translucent Overlay */}
                      <button
                        type="button"
                        onClick={() => setActiveLightboxIndex(1)}
                        aria-label={galleryList.length > 2 ? `View all ${galleryList.length} media items` : `View ${item.title} preview 2`}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer hover:border-white/30 transition-all shadow-sm ring-1 ring-white/5"
                      >
                        {isMediaVideo(galleryList[1]) ? (
                          <video
                            src={getVideoSource(galleryList[1])}
                            poster={getVideoPoster(galleryList[1])}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={galleryList[1]}
                            alt={`${item.title} preview 2`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="eager"
                          />
                        )}

                        {galleryList.length > 2 ? (
                          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
                            <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                              +{galleryList.length - 2}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-200 uppercase tracking-widest mt-0.5 drop-shadow">
                              See More
                            </span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                            <div className="size-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                              <SearchIcon className="size-5" />
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Verified Client Review (from Fiverr) */}
              {item.clientReview && (
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                      <span>Verified Client Review</span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-zinc-400">@{item.clientReview.author}</span>
                    </div>
                    <span className="text-amber-400 font-bold">
                      ★ {item.clientReview.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 italic leading-relaxed">
                    &ldquo;{item.clientReview.comment}&rdquo;
                  </p>
                </div>
              )}

              {/* Dedicated bottom spacer to ensure content and review border are never clipped */}
              <div className="h-6 shrink-0" aria-hidden="true" />
            </div>

            {/* Footer: Symmetrical, precision action bar */}
            <div className="shrink-0 bg-[#161618] px-4 sm:px-6 py-3.5 border-t border-white/[0.08]">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 sm:h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-white/20 active:scale-[0.98]"
                  >
                    {item.externalType === 'fiverr' && <FiverrIcon className="size-4 shrink-0" />}
                    {item.externalType === 'discord' && <DiscordIcon className="size-4 shrink-0" />}
                    {item.externalType === 'github' && <GithubIcon className="size-4 shrink-0" />}
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
                    <OpenInNewIcon className="size-3.5 text-zinc-400 shrink-0" />
                  </a>
                )}

                <a
                  href="#contact"
                  onClick={onClose}
                  className={`h-10 sm:h-11 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] ${
                    !item.externalUrl ? 'col-span-2' : ''
                  }`}
                >
                  <MailIcon className="size-4 shrink-0 text-zinc-950" />
                  <span>Discuss Project</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Discord-Style Fullscreen Lightbox Preview */}
          <AnimatePresence>
            {activeLightboxIndex !== null && galleryList.length > 0 && (
              <motion.div
                key="lightbox-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[120] flex flex-col justify-between p-3 sm:p-6 overflow-hidden select-none"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveLightboxIndex(null)}
                  className="fixed inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
                />

                {/* Top Control Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto py-2 px-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-zinc-400 bg-white/10 px-2.5 py-1 rounded-md">
                      {activeLightboxIndex + 1} / {galleryList.length}
                    </span>
                    <span className="hidden sm:inline-block text-xs font-semibold text-zinc-300 truncate max-w-xs">
                      {item.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveLightboxIndex(null)}
                    aria-label="Close preview"
                    className="size-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer active:scale-95"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </motion.div>

                {/* Center Image Display with Arrow Controls */}
                <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 my-auto px-2 sm:px-12">
                  {/* Previous Button */}
                  {galleryList.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveLightboxIndex((prev) =>
                          prev === null ? 0 : (prev - 1 + galleryList.length) % galleryList.length
                        )
                      }
                      aria-label="Previous image"
                      className="absolute left-1 sm:left-4 z-20 size-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg active:scale-95"
                    >
                      <ChevronLeftIcon className="size-5" />
                    </button>
                  )}

                  {/* Active Media (Image or Video) with Smooth Enter & Exit Scale Animation */}
                  <motion.div
                    key={activeLightboxIndex}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-w-full max-h-[66vh] sm:max-h-[72vh] flex items-center justify-center"
                  >
                    {isMediaVideo(galleryList[activeLightboxIndex]) ? (
                      <video
                        src={getVideoSource(galleryList[activeLightboxIndex])}
                        poster={getVideoPoster(galleryList[activeLightboxIndex])}
                        autoPlay
                        loop
                        controls
                        playsInline
                        className="max-w-full max-h-[66vh] sm:max-h-[72vh] object-contain rounded-xl border border-white/15 shadow-2xl bg-black"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={galleryList[activeLightboxIndex].replace('t_delivery_thumb,', '')}
                        alt={`${item.title} enlarged ${activeLightboxIndex + 1}`}
                        className="max-w-full max-h-[66vh] sm:max-h-[72vh] object-contain rounded-xl border border-white/15 shadow-2xl bg-black/60"
                      />
                    )}
                  </motion.div>

                  {/* Next Button */}
                  {galleryList.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveLightboxIndex((prev) =>
                          prev === null ? 0 : (prev + 1) % galleryList.length
                        )
                      }
                      aria-label="Next image"
                      className="absolute right-1 sm:right-4 z-20 size-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg active:scale-95"
                    >
                      <ChevronRightIcon className="size-5" />
                    </button>
                  )}
                </div>

                {/* Bottom Discord-Style Thumbnail Strip */}
                {galleryList.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 w-full max-w-xl mx-auto pt-2 pb-1 flex justify-center"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#121214]/90 border border-white/10 rounded-2xl backdrop-blur-md max-w-full overflow-x-auto shadow-2xl">
                      {galleryList.map((thumbUrl, idx) => {
                        const isActive = idx === activeLightboxIndex;
                        const poster = isMediaVideo(thumbUrl) ? getVideoPoster(thumbUrl) : thumbUrl;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveLightboxIndex(idx)}
                            className={`size-12 sm:size-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                              isActive
                                ? 'border-white scale-105 opacity-100 shadow-md ring-2 ring-white/20'
                                : 'border-transparent opacity-50 hover:opacity-80'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={poster}
                              alt={`Thumb ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
