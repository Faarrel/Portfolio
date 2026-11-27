import { ProjectItem } from '@/types/portfolio';

export const FIVERR_LINKS = {
  portfolio: 'https://www.fiverr.com/users/faarrel/portfolio',
  animatedProfile: 'https://www.fiverr.com/faarrel/animate-your-discord-profile',
};

export const PERSONAL_INFO = {
  name: 'Faarrel',
  email: 'muhammadfarrelyf@gmail.com',
  discordHandle: 'faarrel',
  socials: {
    discord: 'https://discord.com/users/938045579215380510',
    github: 'https://github.com/Faarrel',
    instagram: 'https://www.instagram.com/fxrrel_/',
    fiverr: 'https://www.fiverr.com/faarrel',
  },
};

export const GRAPHIC_DESIGN_GALLERY = [
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/9cfc3526fec9e2c07f10d5305eb57165-1750905742/ezgif.com-resize.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/35c86ccae4d85eb9c68d3164f84e196a-1731949812/ProyekBaru1480488CD1-ezgif.com-optimize.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/7bf565b8180a7b7bab3a27d621dff533-1725288745/ProyekBaru1312888DFD-ezgif.com-optimize.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/2246a22570ada89c06887478b5f82aed-1724721254/ProyekBaru1316D845E2-ezgif.com-optimize.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/96cddc565f2c23be4fc635084fa7ccec-1733231122/phantom%20troupe.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/d06f148b7e46ace8b6ed243fea396414-1718255197/Proyek%20Baru%2085%20Copy%20_7A013C0_.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/93c9d882a153cbf7bcd046f0d5b2a324-1772705045/12096.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/9c0e088548c8277aa73f09f3ecd3a918-1771513906/8158.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/b388f25eff8aaf85381d55a739df1a5c-1760050191/ezgif.com-optimize%20%286%29.gif',
];

export const CHARACTER_ANIMATION_GALLERY = [
  'https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/jnfbmxmd0zr3i6dckiwi',
  'https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/unsyi0wf97mhaxi3vebk',
  'https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/pkz7ru1v6ipdazl57we2',
  'https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/ojyaecuzszurtbzejgsf',
];

export const DISCORD_ARCHITECTURE_GALLERY = [
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/3e1924c7d8dabb27526975cc6bf5793e-1721827595/spartan-ezgif.com-resize.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/96cddc565f2c23be4fc635084fa7ccec-1733231122/phantom%20troupe.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/594600171991ce19c4a539111a613d69-1732276435/Proyek%20Baru%20149%20_7534B5F_.gif',
  'https://fiverr-res.cloudinary.com/image/upload/t_main1,q_auto,f_auto,q_auto,f_auto/v1/attachments/delivery/asset/b6611c4e8d5e6724938ad26dee4a9970-1748179384/1000302035.gif',
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'discord-animated-graphics',
    title: 'Custom Animated Discord PFP & Banner (Profile & Server)',
    category: 'motion',
    categoryLabel: 'Discord Profile & Server Art',
    description: 'Custom animated profile avatars and high-impact banners designed for both personal Discord Nitro profiles and Discord server communities. Featuring 60 FPS loops, character motion, and kinetic typography.',
    year: '2024 - 2026',
    role: 'Motion Designer & Compositor',
    tools: ['After Effects', 'Photoshop', 'Alight Motion'],
    metrics: '300+ Delivered Orders · 5.0 Rating · 60 FPS',
    previewUrl: GRAPHIC_DESIGN_GALLERY[0],
    gallery: GRAPHIC_DESIGN_GALLERY,
    externalUrl: FIVERR_LINKS.portfolio,
    externalLabel: 'View on Fiverr',
    externalType: 'fiverr',
    details: [
      'Personal Discord Nitro: 60 FPS looped profile avatars and bio banners',
      'Discord Server Communities: custom server icons, welcome banners, and channel artwork',
      'Ultra-crisp GIF & APNG exports strictly under Discord upload file size limits',
    ],
  },
  {
    id: 'character-animation-puppet',
    title: 'Character Animation & 2D Puppet Motion',
    category: 'rigging',
    categoryLabel: 'Character Animation',
    description: 'Transforming static 2D character artwork and anime illustrations into lifelike looped animations using After Effects puppet pins, mesh deformation, and physics simulations.',
    year: '2024 - 2026',
    role: 'Lead Animator & Rigger',
    tools: ['After Effects', 'Photoshop', 'Alight Motion'],
    metrics: '136+ Fiverr Reviews · 5.0 Rating · 60 FPS',
    previewUrl: 'https://fiverr-res.cloudinary.com/video/upload/so_0/jnfbmxmd0zr3i6dckiwi.jpg',
    gallery: CHARACTER_ANIMATION_GALLERY,
    externalUrl: FIVERR_LINKS.animatedProfile,
    externalLabel: 'View on Fiverr',
    externalType: 'fiverr',
    details: [
      'Multi-layer PSD separation: hair, eyes, facial expressions, and clothing physics',
      'Smooth 60 FPS looped output delivered as high-definition MP4/GIF/APNG',
    ],
  },
  {
    id: 'creative-developer-portfolio',
    title: 'Faarrel Creative Portfolio & Client Portal',
    category: 'dev',
    categoryLabel: 'Web Development',
    description: 'Fast, minimal developer portfolio and client portal built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. Pinned repository on Faarrel\'s GitHub.',
    year: '2026',
    role: 'Fullstack Creative Developer',
    tools: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    metrics: 'Pinned GitHub Repo · 100% Lighthouse Score',
    previewUrl: '/og-image.webp',
    gallery: [
      '/og-image.webp',
      '/logo.webp',
    ],
    externalUrl: 'https://github.com/Faarrel/Portfolio',
    externalLabel: 'View on GitHub',
    externalType: 'github',
    details: [
      'Engineered with modern App Router and Turbopack for instant sub-second response',
      'Live Lanyard Discord presence integration with minimal, zero-slop architecture',
    ],
  },
  {
    id: 'discord-bot-automation',
    title: 'Discord Bot & Automation Backend Pipeline',
    category: 'dev',
    categoryLabel: 'Bot & Backend Dev',
    description: 'Custom Discord bot architecture and automated management pipelines built with TypeScript, discord.js, and Python backend services. Features slash commands, permission gates, and webhook integrations.',
    year: '2025 - 2026',
    role: 'Backend & Bot Engineer',
    tools: ['TypeScript', 'discord.js', 'Node.js', 'Python', 'Discord API'],
    metrics: 'Fast Event Dispatch · 99.9% Uptime',
    externalUrl: 'https://github.com/Faarrel',
    externalLabel: 'View on GitHub',
    externalType: 'github',
    details: [
      'Modular event-driven command handler with slash command deployment',
      'Secure role gatekeeping and webhook logging infrastructure',
    ],
  },
];
