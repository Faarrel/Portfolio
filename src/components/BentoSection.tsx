'use client';

import { motion } from 'framer-motion';
import {
  AutoAwesomeIcon,
  LayersIcon,
  LinkIcon,
  GraphicEqIcon,
  ChevronRightIcon,
  OpenInNewIcon,
  SmartToyIcon,
  MovieIcon,
  CodeIcon,
  DiscordIcon,
  GithubIcon,
  InstagramIcon,
  FiverrIcon,
} from '@/components/ui/material-symbols';
import { PERSONAL_INFO, PROJECTS } from '@/data/portfolioData';
import DiscordPresenceCard from '@/components/DiscordPresenceCard';

// 1:1 Exact Geometric & Organic Vector Masks from Shape Reference Catalog (Non-clipping, wide interior)
const CUSTOM_MASKS = {
  // 1. 4-Sided Cookie (Row 4, Col 2 in reference) - Card 1: i'm faarrel
  cookie4: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath fill='currentColor' d='M 50,5 C 65,5 80,0 90,10 C 100,20 95,35 95,50 C 95,65 100,80 90,90 C 80,100 65,95 50,95 C 35,95 20,100 10,90 C 0,80 5,65 5,50 C 5,35 0,20 10,10 C 20,0 35,5 50,5 Z'/%3E%3C/svg%3E")`,

  // 2. 8-Leaf Clover / Rosette (Row 5, Col 3 in reference) - Card 2: what i've made
  clover8: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath fill='currentColor' d='M 98,50 C 98,56.8 87.2,59.6 85.1,64.5 C 83.1,69.5 88.7,79.1 83.9,83.9 C 79.1,88.7 69.5,83.1 64.5,85.1 C 59.6,87.2 56.8,98 50,98 C 43.2,98 40.4,87.2 35.5,85.1 C 30.5,83.1 20.9,88.7 16.1,83.9 C 11.3,79.1 16.9,69.5 14.9,64.5 C 12.8,59.6 2,56.8 2,50 C 2,43.2 12.8,40.4 14.9,35.5 C 16.9,30.5 11.3,20.9 16.1,16.1 C 20.9,11.3 30.5,16.9 35.5,14.9 C 40.4,12.8 43.2,2 50,2 C 56.8,2 59.6,12.8 64.5,14.9 C 69.5,16.9 79.1,11.3 83.9,16.1 C 88.7,20.9 83.1,30.5 85.1,35.5 C 87.2,40.4 98,43.2 98,50 Z'/%3E%3C/svg%3E")`,

  // 3. Gem (Row 3, Col 4 in reference) - Card 3: where to find me
  gem: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath fill='currentColor' d='M 30,8 L 70,8 Q 84,8 90,20 L 96,38 Q 98,46 94,54 L 84,82 Q 80,92 68,92 L 32,92 Q 20,92 16,82 L 6,54 Q 2,46 4,38 L 10,20 Q 16,8 30,8 Z'/%3E%3C/svg%3E")`,

  // 4. Pill / Tilted Pebble (Row 2, Col 2 in reference) - Card 4: selected highlights
  pill: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath fill='currentColor' d='M 36,8 C 58,-1 80,6 91,24 C 102,42 98,68 84,85 C 70,100 42,98 25,86 C 8,72 0,48 8,30 C 14,16 23,10 36,8 Z'/%3E%3C/svg%3E")`,

  // 5. Bloated Organic Badge (Wide interior, zero clipping) - Card: live status
  organicBadge: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath fill='currentColor' d='M 50,6 C 66,6 80,4 88,14 C 98,24 94,38 94,50 C 94,62 98,76 88,86 C 78,96 66,94 50,94 C 34,94 22,96 12,86 C 2,76 6,62 6,50 C 6,38 2,24 12,14 C 20,4 34,6 50,6 Z'/%3E%3C/svg%3E")`,
};

function OrganicIconBadge({
  mask,
  bg = 'bg-white',
  textColor = 'text-zinc-950',
  children,
  className = 'size-12 mb-3.5 sm:mb-4',
}: {
  mask: string;
  bg?: string;
  textColor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center p-2.5 shrink-0 ${bg} ${textColor} ${className}`}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    >
      {children}
    </div>
  );
}

export default function BentoSection() {
  const capabilitiesList = [
    {
      icon: LayersIcon,
      title: 'Graphic Design & Visual Identity',
      subtitle: 'Visual branding, posters & creative assets (Photoshop, Alight Motion)',
      href: '#contact',
    },
    {
      icon: MovieIcon,
      title: 'Character Animation & Puppet Motion',
      subtitle: 'Breathing loops, eye physics & dynamic motion in After Effects',
      href: '#contact',
    },
    {
      icon: SmartToyIcon,
      title: 'Discord Server Architecture',
      subtitle: 'Turnkey guild setup, role hierarchies & anti-raid defense systems',
      href: '#contact',
    },
    {
      icon: CodeIcon,
      title: 'Fullstack Web & Discord Bot Dev',
      subtitle: 'Next.js 16, TypeScript, discord.js & discord.py backend pipelines',
      href: '#contact',
    },
  ];

  const socialLinks = [
    { label: 'Discord', handle: PERSONAL_INFO.discordHandle, href: PERSONAL_INFO.socials.discord, icon: DiscordIcon },
    { label: 'GitHub', handle: 'Faarrel', href: PERSONAL_INFO.socials.github, icon: GithubIcon },
    { label: 'Instagram', handle: 'fxrrel_', href: PERSONAL_INFO.socials.instagram, icon: InstagramIcon },
    { label: 'Fiverr', handle: 'faarrel', href: PERSONAL_INFO.socials.fiverr, icon: FiverrIcon },
  ];

  const featuredProject = PROJECTS[0];
  const secondaryProjects = PROJECTS.slice(1, 3);

  return (
    <section id="work" className="py-16 sm:py-28 px-4 sm:px-8 md:px-12 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance">
              identity &amp; craft<span className="text-[#888888]">.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-base text-zinc-100 max-w-md font-medium leading-relaxed text-pretty text-right sm:self-end ml-auto">
            An organic bento hub spanning personal identity, live presence, capabilities, and selected works.
          </p>
        </motion.div>

        {/* Abstract Two-Column Masonry Layout (Exact Reference: bignut.zip) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column (wg4quu) */}
          <div className="contents lg:flex lg:flex-col lg:gap-6 lg:w-full">
            {/* ---------------- CARD 1: i'm faarrel ---------------- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-none w-full bg-[#161618]/95 border border-[#27272a] rounded-[28px] p-5 sm:p-7 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[260px] sm:min-h-[280px]"
            >
              {/* Right-center luminous radial ambient gradient */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 70%)',
                }}
              />

              <div className="relative z-10 max-w-[58%] sm:max-w-[62%]">
                {/* Custom Organic Top Icon Badge (4-Sided Cookie - Theme White) */}
                <OrganicIconBadge mask={CUSTOM_MASKS.cookie4} bg="bg-white" textColor="text-zinc-950">
                  <AutoAwesomeIcon className="size-5" />
                </OrganicIconBadge>

                {/* Title & Professional Profile Capabilities */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 sm:mb-4">
                    i&apos;m <span className="font-planet-kosmos text-2xl sm:text-3xl font-normal tracking-wide text-white" style={{ fontFamily: "'Planet Kosmos', sans-serif" }}>faarrel</span>
                  </h3>

                  <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-zinc-300 font-medium">
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="size-1.5 rounded-full bg-zinc-400 shrink-0 mt-2" />
                      <span>Computer Science graduate operating at the intersection of design &amp; code</span>
                    </li>
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="size-1.5 rounded-full bg-zinc-400 shrink-0 mt-2" />
                      <span>Specializing in 2D character puppet animation &amp; motion design (After Effects)</span>
                    </li>
                    <li className="flex items-start gap-2.5 leading-relaxed">
                      <span className="size-1.5 rounded-full bg-zinc-400 shrink-0 mt-2" />
                      <span>Engineering secure Discord server architecture &amp; fullstack web applications</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right-Center Aligned 3D Logo */}
              <img
                src="/logo.png"
                alt="Faarrel"
                className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 md:right-8 w-28 sm:w-36 md:w-44 h-auto object-contain pointer-events-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)] select-none z-10"
              />
            </motion.div>

            {/* ---------------- CARD 2: live status (discord) ---------------- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-none w-full bg-[#161618]/95 border border-[#27272a] rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Custom Organic Top Icon Badge (Bloated Organic - Theme Graphite) */}
                <OrganicIconBadge mask={CUSTOM_MASKS.organicBadge} bg="bg-[#2a2a30]" textColor="text-white">
                  <DiscordIcon className="size-5" />
                </OrganicIconBadge>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 sm:mb-5">
                  live status
                </h3>

                {/* Live Discord Status Widget */}
                <DiscordPresenceCard />
              </div>
            </motion.div>

            {/* ---------------- CARD 3: where to find me ---------------- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="order-5 lg:order-none w-full bg-[#161618]/95 border border-[#27272a] rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Custom Organic Top Icon Badge (Gem - Theme White) */}
                <OrganicIconBadge mask={CUSTOM_MASKS.gem} bg="bg-white" textColor="text-zinc-950">
                  <LinkIcon className="size-5" />
                </OrganicIconBadge>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 sm:mb-5">
                  where to find me
                </h3>

                {/* Segmented Button Stack */}
                <div className="rounded-2xl overflow-hidden flex flex-col gap-[2px] bg-[#27272a]/30">
                  {socialLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.18 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-[#202024] hover:bg-[#28282e] p-3.5 sm:p-4 flex items-center justify-between gap-3.5 transition-colors group/item cursor-pointer rounded-[4px]"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Icon className="size-5 text-zinc-300 group-hover/item:text-white transition-colors shrink-0" />
                          <div className="min-w-0">
                            <b className="block text-xs sm:text-sm font-bold text-zinc-100 group-hover/item:text-white transition-colors truncate">
                              {link.handle}
                            </b>
                            <span className="block text-[11px] sm:text-xs text-zinc-400 font-medium group-hover/item:text-zinc-200 transition-colors truncate">
                              {link.label}
                            </span>
                          </div>
                        </div>
                        <OpenInNewIcon className="size-4 text-zinc-500 group-hover/item:text-white transition-colors shrink-0" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (wg4quu right) */}
          <div className="contents lg:flex lg:flex-col lg:gap-6 lg:w-full">
            {/* ---------------- CARD 4: what i've made ---------------- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="order-3 lg:order-none w-full bg-[#161618]/95 border border-[#27272a] rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Custom Organic Top Icon Badge (8-Leaf Clover - Theme Graphite) */}
                <OrganicIconBadge mask={CUSTOM_MASKS.clover8} bg="bg-[#2a2a30]" textColor="text-white">
                  <LayersIcon className="size-5" />
                </OrganicIconBadge>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 sm:mb-5">
                  what i&apos;ve made
                </h3>

                {/* Segmented Button Stack */}
                <div className="rounded-2xl overflow-hidden flex flex-col gap-[2px] bg-[#27272a]/30">
                  {capabilitiesList.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.title}
                        href={item.href}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.15 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-[#202024] hover:bg-[#28282e] p-3.5 sm:p-4 flex items-center justify-between gap-3.5 transition-colors group/item cursor-pointer rounded-[4px]"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Icon className="size-5 text-zinc-300 group-hover/item:text-white transition-colors shrink-0" />
                          <div className="min-w-0">
                            <b className="block text-xs sm:text-sm font-bold text-zinc-100 group-hover/item:text-white transition-colors truncate">
                              {item.title}
                            </b>
                            <span className="block text-[11px] sm:text-xs text-zinc-400 font-medium group-hover/item:text-zinc-200 transition-colors truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>
                        <ChevronRightIcon className="size-4 text-zinc-500 group-hover/item:text-white transition-colors shrink-0" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ---------------- CARD 5: selected highlights ---------------- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-4 lg:order-none w-full bg-[#161618]/95 border border-[#27272a] rounded-[28px] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-sm group"
            >
            <div>
              {/* Custom Organic Top Icon Badge (Pill - Theme White) */}
              <OrganicIconBadge mask={CUSTOM_MASKS.pill} bg="bg-white" textColor="text-zinc-950">
                <GraphicEqIcon className="size-5" />
              </OrganicIconBadge>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 sm:mb-5">
                selected highlights
              </h3>

              {/* Featured Showcase Item */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#202024] border border-[#27272a] mb-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-200 font-semibold mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-300">ıll</span>
                    <span className="text-zinc-100 font-bold">{PERSONAL_INFO.name}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-100 font-semibold bg-[#2a2a30] px-2.5 py-1 rounded-md">
                    After Effects Puppet &amp; Motion
                  </span>
                </div>

                <div>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Featured Animated Illustration
                  </span>
                  <div className="text-base sm:text-xl font-bold text-white mt-1">
                    {featuredProject.title}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed font-medium text-pretty">
                    Static 2D character illustration brought to life in After Effects: natural blinking eyes, dynamic hair physics sway, rhythmic breathing motion, and ambient particle glow.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#2a2a30] flex items-center justify-between text-xs text-zinc-200 font-medium">
                  <span className="text-zinc-400 font-medium text-[11px] sm:text-xs">{featuredProject.metrics}</span>
                  <a
                    href="#contact"
                    className="text-white hover:text-zinc-200 font-semibold flex items-center gap-1 transition-colors text-[11px] sm:text-xs cursor-pointer"
                  >
                    Featured Work <OpenInNewIcon className="size-3.5" />
                  </a>
                </div>
              </div>

              {/* Secondary Projects - Segmented Button Stack */}
              <div className="rounded-2xl overflow-hidden flex flex-col gap-[2px] bg-[#27272a]/30">
                {secondaryProjects.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.22 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#202024] hover:bg-[#28282e] p-3.5 sm:p-4 flex items-center justify-between gap-3.5 transition-colors group/item cursor-pointer rounded-[4px]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <MovieIcon className="size-5 text-zinc-300 group-hover/item:text-white transition-colors shrink-0" />
                      <div className="min-w-0">
                        <b className="block text-xs sm:text-sm font-bold text-zinc-100 group-hover/item:text-white transition-colors truncate">
                          {p.title}
                        </b>
                        <span className="block text-[11px] sm:text-xs text-zinc-400 font-medium group-hover/item:text-zinc-200 transition-colors truncate">
                          {p.categoryLabel} · {p.year} ({p.role})
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon className="size-4 text-zinc-500 group-hover/item:text-white transition-colors shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
