'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloseIcon,
  OpenInNewIcon,
  GithubIcon,
  MailIcon,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop with frosted dark blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#161618] border border-[#27272a] rounded-[24px] p-6 sm:p-8 shadow-2xl z-10 flex flex-col gap-6"
          >
            {/* Header: Category Badge & Close Button */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {item.categoryLabel || 'Showcase'}
              </span>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="size-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* Title & Metadata */}
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white text-balance">
                {item.title}
              </h3>

              {(item.role || item.year) && (
                <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1.5">
                  {item.role} {item.role && item.year && '·'} {item.year}
                </p>
              )}

              {item.metrics && (
                <div className="inline-block mt-2.5 text-xs font-mono font-medium text-zinc-300 bg-[#202024] border border-[#27272a] px-3 py-1 rounded-md">
                  ⏱ {item.metrics}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              {item.description}
            </p>

            {/* Key Deliverables / Highlights */}
            {item.details && item.details.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Key Highlights &amp; Architecture
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="size-1.5 rounded-full bg-zinc-400 shrink-0 mt-2" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tools / Tech Stack Pills */}
            {item.tools && item.tools.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Tools &amp; Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs font-medium text-zinc-200 bg-[#202024] border border-[#27272a] px-2.5 py-1 rounded-md"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <GithubIcon className="size-4" />
                    <span>GitHub</span>
                    <OpenInNewIcon className="size-3 text-zinc-400" />
                  </a>
                )}
                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>View Project</span>
                    <OpenInNewIcon className="size-3 text-zinc-400" />
                  </a>
                )}
              </div>

              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <MailIcon className="size-4" />
                <span>Discuss Project</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
