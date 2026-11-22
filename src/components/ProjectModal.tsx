'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloseIcon,
  OpenInNewIcon,
  GithubIcon,
  MailIcon,
  FiverrIcon,
  DiscordIcon,
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

export default function ProjectModal({ item, onClose }: ProjectModalProps) {
  const [activeLightboxMedia, setActiveLightboxMedia] = useState<string | null>(null);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeLightboxMedia) {
          setActiveLightboxMedia(null);
        } else {
          onClose();
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
  }, [item, onClose, activeLightboxMedia]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
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
            className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[88vh] max-h-[88dvh] bg-[#161618] border border-[#27272a] rounded-[20px] sm:rounded-[24px] shadow-2xl z-10 flex flex-col overflow-hidden"
          >
            {/* Header: Fixed top bar */}
            <div className="shrink-0 bg-[#161618] px-4 sm:px-6 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full shrink-0">
                  {item.categoryLabel || 'Showcase'}
                </span>
                {item.metrics && (
                  <span className="hidden sm:inline-block text-xs font-mono font-medium text-zinc-400 bg-[#202024] border border-[#27272a] px-2 py-0.5 rounded-md truncate max-w-[220px]">
                    ⏱ {item.metrics}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="size-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* Scrollable Content Area: strictly constrained by min-h-0 to avoid overflow */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
              {/* Media Collage / Gallery */}
              {item.gallery && item.gallery.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-[11px] uppercase tracking-wider font-semibold">
                      Gallery &amp; Delivered Works ({item.gallery.length})
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Tap image to enlarge
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {item.gallery.map((mediaUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveLightboxMedia(mediaUrl)}
                        className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer hover:border-white/30 transition-all hover:scale-[1.02] shadow-sm flex items-center justify-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl}
                          alt={`${item.title} preview ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold gap-1">
                          <span>View 🔍</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : item.previewUrl ? (
                <button
                  type="button"
                  onClick={() => setActiveLightboxMedia(item.previewUrl!)}
                  className="relative w-full rounded-xl overflow-hidden bg-black/50 border border-white/10 aspect-video sm:aspect-[16/9] flex items-center justify-center group cursor-pointer hover:border-white/30 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-contain p-2"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                    <span>Tap to enlarge 🔍</span>
                  </div>
                </button>
              ) : null}

              {/* Title & Metadata */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  {item.title}
                </h3>

                {(item.role || item.year) && (
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    {item.role} {item.role && item.year && '·'} {item.year}
                  </p>
                )}

                {item.metrics && (
                  <div className="sm:hidden inline-block mt-2 text-xs font-mono font-medium text-zinc-400 bg-[#202024] border border-[#27272a] px-2 py-0.5 rounded-md">
                    ⏱ {item.metrics}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {item.description}
              </p>

              {/* Key Highlights */}
              {item.details && item.details.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-1">
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

              {/* Tools / Tech Stack Pills */}
              {item.tools && item.tools.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] font-medium text-zinc-200 bg-[#202024] border border-[#27272a] px-2.5 py-0.5 rounded-md"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Verified Client Review (from Fiverr) */}
              {item.clientReview && (
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
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
            </div>

            {/* Footer: Fixed bottom action bar */}
            <div className="shrink-0 bg-[#161618] px-4 sm:px-6 py-3 border-t border-white/[0.08] flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    {item.externalType === 'fiverr' && <FiverrIcon className="size-3.5" />}
                    {item.externalType === 'discord' && <DiscordIcon className="size-3.5" />}
                    {item.externalType === 'github' && <GithubIcon className="size-3.5" />}
                    <span>
                      {item.externalLabel ||
                        (item.externalType === 'fiverr'
                          ? 'View on Fiverr'
                          : item.externalType === 'discord'
                          ? 'Contact on Discord'
                          : item.externalType === 'github'
                          ? 'View on GitHub'
                          : 'View Project')}
                    </span>
                    <OpenInNewIcon className="size-3 text-zinc-400" />
                  </a>
                )}
                {item.githubUrl && item.githubUrl !== item.externalUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <GithubIcon className="size-3.5" />
                    <span>GitHub</span>
                    <OpenInNewIcon className="size-3 text-zinc-400" />
                  </a>
                )}
              </div>

              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <MailIcon className="size-3.5" />
                <span>Discuss</span>
              </a>
            </div>
          </motion.div>

          {/* Lightbox / Zoomed Preview Modal */}
          <AnimatePresence>
            {activeLightboxMedia && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveLightboxMedia(null)}
                  className="fixed inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative max-w-4xl max-h-[90vh] z-10 flex flex-col items-center justify-center p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeLightboxMedia.replace('t_delivery_thumb,', '')}
                    alt="Enlarged preview"
                    className="max-w-full max-h-[80vh] object-contain rounded-xl border border-white/20 shadow-2xl bg-black/80"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveLightboxMedia(null)}
                    aria-label="Close enlarged preview"
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    <CloseIcon className="size-3.5" />
                    <span>Close Preview</span>
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
