'use client';

import { useEffect } from 'react';
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
  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
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
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-xl md:max-w-2xl max-h-[92dvh] sm:max-h-[88vh] bg-[#161618] border border-[#27272a] rounded-t-[24px] sm:rounded-[24px] shadow-2xl z-10 flex flex-col overflow-hidden"
          >
            {/* Sticky Top Header */}
            <div className="sticky top-0 z-20 bg-[#161618]/95 backdrop-blur-md px-5 sm:px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {item.categoryLabel || 'Showcase'}
                </span>
                {item.metrics && (
                  <span className="hidden sm:inline-block text-xs font-mono font-medium text-zinc-400 bg-[#202024] border border-[#27272a] px-2.5 py-0.5 rounded-md truncate max-w-[220px]">
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

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
              {/* Media Preview (GIF / Video / Image from Fiverr or Local CDN) */}
              {item.previewUrl && (
                <div className="relative w-full rounded-xl overflow-hidden bg-black/60 border border-white/10 aspect-video sm:aspect-[16/9] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-contain sm:object-cover"
                    loading="eager"
                  />
                </div>
              )}

              {/* Title & Metadata */}
              <div>
                <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  {item.title}
                </h3>

                {(item.role || item.year) && (
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    {item.role} {item.role && item.year && '·'} {item.year}
                  </p>
                )}

                {item.metrics && (
                  <div className="sm:hidden inline-block mt-2 text-xs font-mono font-medium text-zinc-400 bg-[#202024] border border-[#27272a] px-2.5 py-0.5 rounded-md">
                    ⏱ {item.metrics}
                  </div>
                )}
              </div>

              {/* Concise Description */}
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

            {/* Sticky Bottom Action Bar */}
            <div className="sticky bottom-0 z-20 bg-[#161618]/95 backdrop-blur-md px-5 sm:px-6 py-3 border-t border-white/[0.08] flex items-center justify-between gap-2.5 shrink-0">
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
        </div>
      )}
    </AnimatePresence>
  );
}
