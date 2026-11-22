'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MailIcon,
  ChatBubbleIcon,
  CheckIcon,
} from '@/components/ui/material-symbols';
import { PERSONAL_INFO } from '@/data/portfolioData';
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.discordHandle);
    setDiscordCopied(true);
    setTimeout(() => setDiscordCopied(false), 2000);
  };

  const footerColumns = [
    {
      title: 'Connect',
      links: [
        { label: 'Discord', href: PERSONAL_INFO.socials.discord },
        { label: 'GitHub', href: PERSONAL_INFO.socials.github },
        { label: 'Instagram', href: PERSONAL_INFO.socials.instagram },
        { label: 'Fiverr', href: PERSONAL_INFO.socials.fiverr },
        { label: 'Email', href: `mailto:${PERSONAL_INFO.email}` },
      ],
    },
  ];

  return (
    <footer id="contact" className="pt-20 sm:pt-28 relative overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3.5 mb-4"
          >
            <img src="/logo.png" alt="Faarrel" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F4F5] text-balance">
              Let&apos;s talk<span className="text-[#888888]">.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base md:text-lg text-zinc-200 max-w-xl leading-relaxed mb-8 text-pretty font-medium"
          >
            Available for graphic design, character animation, Discord server build &amp; setup, and fullstack development (web &amp; discord bot). Open for global commissions.
          </motion.p>

          {/* Action Buttons (Balanced, cleanly centered pills for mobile and desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 max-w-lg"
          >
            <button
              onClick={handleCopyEmail}
              className="group flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-6 h-11 sm:h-12 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
            >
              <MailIcon className="size-4 text-zinc-950 shrink-0" />
              <span className="truncate">{PERSONAL_INFO.email}</span>
              {copied && <CheckIcon className="size-4 text-emerald-600 shrink-0" />}
            </button>

            <button
              onClick={handleCopyDiscord}
              className="flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-6 h-11 sm:h-12 rounded-full bg-[#18181b] border border-[#27272a] hover:bg-[#202024] text-zinc-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer w-full sm:w-auto"
            >
              <ChatBubbleIcon className="size-4 text-zinc-300 shrink-0" />
              <span>Discord: <strong className="text-white font-bold">@{PERSONAL_INFO.discordHandle}</strong></span>
              {discordCopied && <CheckIcon className="size-4 text-emerald-400 shrink-0" />}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Halftone Wordmark Interactive Spring Canvas Footer with Palette */}
      <HalftoneWordmarkFooter
        wordmark="faarrel"
        label="FAARREL STUDIO"
        meta="B.S. in Computer Science · Graphic Designer · Character Animator · Fullstack Developer"
        columns={footerColumns}
        backToTop={false}
        preset="night"
        palette={{ background: '#121212', ink: '#E0E0E0', warm: '#888888' }}
        height="560px"
        tabletHeight="460px"
        mobileHeight="380px"
        crop={0.25}
      />
    </footer>
  );
}
