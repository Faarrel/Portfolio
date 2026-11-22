'use client';

import { useState } from 'react';
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
import ProjectModal, { ProjectModalItem } from '@/components/ProjectModal';

// Clean Geometric Shapes from Reference (100% regular, non-abstract, non-clipping)
const CUSTOM_MASKS = {
  // Shape 4: 4-Leaf Symmetrical Clover (Card 1: i'm faarrel)
  clover4: `url('/shapes/shape-4.png')`,

  // 6-Lobed Scallop Flower (Card 2: live status)
  scallop6: `url('/shapes/shape-live-status.png')`,

  // Shape 3: 8-Pointed Star / Scallop Badge (Card 3: where to find me)
  star8: `url('/shapes/shape-3.png')`,

  // Shape 5: 12-Lobed Cluster Rosette (Card 4: what i've made)
  rosette12: `url('/shapes/shape-5.png')`,

  // Shape 0: Slanted Squircle (Card 5: selected highlights)
  slantedSquircle: `url('/shapes/shape-0.png')`,
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
  const [activeModalItem, setActiveModalItem] = useState<ProjectModalItem | null>(null);

  const capabilitiesList = [
    {
      icon: LayersIcon,
      title: 'Graphic Design & Visual Identity',
      subtitle: 'Visual branding, posters & creative assets (Photoshop, Alight Motion)',
      modalData: {
        title: 'Graphic Design & Visual Identity',
        categoryLabel: 'Design & Visual Identity',
        description:
          'Comprehensive graphic design, visual branding, promotional posters, and creative assets designed with Photoshop, Alight Motion, and vector styling.',
        role: 'Lead Visual Designer',
        year: '2024 - 2026',
        tools: ['Photoshop', 'Alight Motion', 'Illustrator', 'Figma'],
        metrics: '50+ Delivered Client Branding Packs',
        details: [
          'Brand identity suites, logotypes, color palettes, and typographic hierarchies',
          'High-resolution promotional posters, stream overlays, and banner graphics',
          'Vector illustration and merchandise-ready graphic compositions',
          'Custom icon design and aesthetic monochrome/cyberpunk theme assets',
        ],
        githubUrl: PERSONAL_INFO.socials.github,
      },
    },
    {
      icon: MovieIcon,
      title: 'Character Animation & Puppet Motion',
      subtitle: 'Breathing loops, eye physics & dynamic motion in After Effects',
      modalData: {
        title: 'Character Animation & Puppet Motion',
        categoryLabel: 'Animation & Motion Rigging',
        description:
          'Transforming static 2D character artwork and anime illustrations into lifelike looped animations using After Effects puppet pins, mesh deformation, and physics simulations.',
        role: 'Character Animator & Motion Designer',
        year: '2024 - 2026',
        tools: ['After Effects', 'Photoshop', 'Alight Motion', 'Puppet Tool'],
        metrics: 'Seamless 60 FPS Loops · 4K Master Exports',
        details: [
          'PSD asset separation: individualizing eyes, pupils, hair layers, garments, and limbs',
          'Natural eye blinks, chest breathing rhythms, and dynamic hair physics sway',
          'Ambient particle effects, atmospheric lighting, and parallax depth compositing',
          'Lightweight web-ready deliverables (MP4, WebM, transparent loops)',
        ],
        githubUrl: PERSONAL_INFO.socials.github,
      },
    },
    {
      icon: SmartToyIcon,
      title: 'Discord Server Architecture',
      subtitle: 'Turnkey guild setup, role hierarchies & anti-raid defense systems',
      modalData: {
        title: 'Discord Server Architecture',
        categoryLabel: 'Community Infrastructure',
        description:
          'Turnkey Discord guild design and infrastructure architecture for creators, gaming communities, and Web3 projects. Built for security, engagement, and automated management.',
        role: 'Guild Architect & Security Specialist',
        year: '2023 - 2026',
        tools: ['Discord API', 'Node.js', 'Python', 'Security Bots', 'Webhook Integrations'],
        metrics: '45,000+ Members Managed · 0 Raid Breaches',
        details: [
          'Tiered role hierarchies, permission matrices, and private moderation channels',
          'Automated anti-raid verification gates with captcha and account age checks',
          'Clean channel taxonomy, custom banner art, embed announcements, and onboarding flows',
          'Integrated ticket dispatchers, mod logs, and community engagement bot routines',
        ],
        githubUrl: PERSONAL_INFO.socials.github,
      },
    },
    {
      icon: CodeIcon,
      title: 'Fullstack Web & Discord Bot Dev',
      subtitle: 'Next.js 16, TypeScript, discord.js & discord.py backend pipelines',
      modalData: {
        title: 'Fullstack Web & Discord Bot Development',
        categoryLabel: 'Engineering & Automation',
        description:
          'Custom Discord bot development and high-performance modern web applications. Specializing in discord.js, discord.py, Next.js, TypeScript, and serverless deployments.',
        role: 'Fullstack & Bot Engineer',
        year: '2023 - 2026',
        tools: ['Next.js 16', 'TypeScript', 'discord.js', 'discord.py', 'Node.js', 'Python', 'PostgreSQL', 'Redis'],
        metrics: 'Sub-15ms Command Latency · 99.9% Production Uptime',
        details: [
          'Production Discord bots with custom slash commands, modals, and event listeners',
          'State machine-driven moderation and webhook automation pipelines',
          'Next.js web applications with modern App Router, responsive design, and Tailwind CSS',
          'Robust database integration, Redis caching, and containerized deployment',
        ],
        githubUrl: PERSONAL_INFO.socials.github,
      },
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
                {/* Top Icon Badge (4-Petal Flower - Theme White) */}
                <OrganicIconBadge mask={CUSTOM_MASKS.clover4} bg="bg-white" textColor="text-zinc-950">
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
                src="/logo.webp"
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
                {/* Top Icon Badge (6-Lobed Scallop Flower - Theme Graphite) */}
                <OrganicIconBadge mask={CUSTOM_MASKS.scallop6} bg="bg-[#2a2a30]" textColor="text-white">
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
                {/* Top Icon Badge (8-Pointed Star - Theme White) */}
                <OrganicIconBadge mask={CUSTOM_MASKS.star8} bg="bg-white" textColor="text-zinc-950">
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
                            <span className="block text-xs text-zinc-400 font-medium group-hover/item:text-zinc-200 transition-colors truncate">
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
                {/* Top Icon Badge (12-Lobed Cluster Rosette - Responsive Alternating Theme) */}
                <OrganicIconBadge
                  mask={CUSTOM_MASKS.rosette12}
                  bg="bg-white lg:bg-[#2a2a30]"
                  textColor="text-zinc-950 lg:text-white"
                >
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
                      <motion.button
                        key={item.title}
                        type="button"
                        onClick={() => setActiveModalItem(item.modalData)}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.15 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full text-left bg-[#202024] hover:bg-[#28282e] p-3.5 sm:p-4 flex items-center justify-between gap-3.5 transition-colors group/item cursor-pointer rounded-[4px]"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Icon className="size-5 text-zinc-300 group-hover/item:text-white transition-colors shrink-0" />
                          <div className="min-w-0">
                            <b className="block text-xs sm:text-sm font-bold text-zinc-100 group-hover/item:text-white transition-colors truncate">
                              {item.title}
                            </b>
                            <span className="block text-xs text-zinc-400 font-medium group-hover/item:text-zinc-200 transition-colors truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>
                        <ChevronRightIcon className="size-4 text-zinc-500 group-hover/item:text-white transition-colors shrink-0" />
                      </motion.button>
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
              {/* Top Icon Badge (Slanted Squircle - Responsive Alternating Theme) */}
              <OrganicIconBadge
                mask={CUSTOM_MASKS.slantedSquircle}
                bg="bg-[#2a2a30] lg:bg-white"
                textColor="text-white lg:text-zinc-950"
              >
                <GraphicEqIcon className="size-5" />
              </OrganicIconBadge>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 sm:mb-5">
                selected highlights
              </h3>

              {/* Featured Showcase Item (Integrated Flow, No Nested Card Frame) */}
              <div
                onClick={() =>
                  setActiveModalItem({
                    ...featuredProject,
                    githubUrl: PERSONAL_INFO.socials.github,
                  })
                }
                className="pb-4 sm:pb-5 mb-4 border-b border-white/[0.08] cursor-pointer group/featured"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-200 font-semibold mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-300">ıll</span>
                    <span className="text-zinc-100 font-bold">{PERSONAL_INFO.name}</span>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-zinc-100 font-semibold bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                    After Effects Puppet &amp; Motion
                  </span>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">
                    Featured Animated Illustration
                  </span>
                  <div className="text-base sm:text-xl font-bold text-white group-hover/featured:text-zinc-200 transition-colors mt-1">
                    {featuredProject.title}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed font-medium text-pretty">
                    Static 2D character illustration brought to life in After Effects: natural blinking eyes, dynamic hair physics sway, rhythmic breathing motion, and ambient particle glow.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-200 font-medium">
                  <span className="text-zinc-400 font-medium text-xs">{featuredProject.metrics}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalItem({
                        ...featuredProject,
                        githubUrl: PERSONAL_INFO.socials.github,
                      });
                    }}
                    className="text-white hover:text-zinc-200 font-semibold flex items-center gap-1 transition-colors text-xs cursor-pointer"
                  >
                    Featured Work <OpenInNewIcon className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Secondary Projects - Segmented Button Stack */}
              <div className="rounded-2xl overflow-hidden flex flex-col gap-[2px] bg-[#27272a]/30">
                {secondaryProjects.map((p, idx) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setActiveModalItem({
                        ...p,
                        githubUrl: PERSONAL_INFO.socials.github,
                      })
                    }
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.22 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full text-left bg-[#202024] hover:bg-[#28282e] p-3.5 sm:p-4 flex items-center justify-between gap-3.5 transition-colors group/item cursor-pointer rounded-[4px]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <MovieIcon className="size-5 text-zinc-300 group-hover/item:text-white transition-colors shrink-0" />
                      <div className="min-w-0">
                        <b className="block text-xs sm:text-sm font-bold text-zinc-100 group-hover/item:text-white transition-colors truncate">
                          {p.title}
                        </b>
                        <span className="block text-xs text-zinc-400 font-medium group-hover/item:text-zinc-200 transition-colors truncate">
                          {p.categoryLabel} · {p.year} ({p.role})
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon className="size-4 text-zinc-500 group-hover/item:text-white transition-colors shrink-0" />
                  </motion.button>
                ))}
              </div>
            </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Project & Capability Details Modal */}
      <ProjectModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </section>
  );
}
