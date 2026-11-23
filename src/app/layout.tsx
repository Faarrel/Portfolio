import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#121212",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://faarrel.my.id"),
  title: "Faarrel | Graphic Designer, Character Animator & Fullstack Developer",
  description: "Portfolio of Faarrel: Graphic design (Photoshop, Alight Motion), character animation & puppet motion (After Effects), Discord server architecture, and fullstack development (Next.js & discord.js/discord.py).",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.webp",
  },
  keywords: [
    "Faarrel",
    "Graphic Designer",
    "Character Animator",
    "Puppet Animation",
    "After Effects",
    "Discord Server Architect",
    "Discord Bot Developer",
    "Fullstack Developer",
    "Next.js",
  ],
  authors: [{ name: "Faarrel" }],
  verification: {
    google: "x2GSOWUpnLjT_3wbfMHg6G3Ww9giV278oQ5efpaPsKU",
  },
  openGraph: {
    title: "Faarrel | Graphic Designer, Character Animator & Fullstack Developer",
    description: "Graphic design, character animation in After Effects, Discord server builds, and fullstack engineering.",
    url: "https://faarrel.my.id",
    siteName: "Faarrel Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Faarrel Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faarrel | Graphic Designer, Character Animator & Fullstack Developer",
    description: "Graphic design, character animation in After Effects, Discord server builds, and fullstack engineering.",
    images: ["/og-image.png"],
  },
};

const DISCORD_COMPONENT_EMBED = {
  component: {
    type: 17,
    accent_color: 16777215,
    spoiler: false,
    components: [
      {
        type: 10,
        content:
          "# [Faarrel](https://faarrel.my.id)\n**Graphic Designer · Character Animator · Fullstack Developer**\n\nOperating at the intersection of visual creativity and engineering. Specializing in graphic design (Photoshop, Alight Motion), character animation (After Effects), Discord server architecture, and fullstack web & bot development.",
      },
      {
        type: 12,
        items: [
          {
            media: {
              url: "https://faarrel.my.id/og-image.png",
            },
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "Visit Portfolio",
            url: "https://faarrel.my.id",
          },
          {
            type: 2,
            style: 5,
            label: "Fiverr Services",
            url: "https://www.fiverr.com/faarrel",
          },
          {
            type: 2,
            style: 5,
            label: "Discord Profile",
            url: "https://discord.com/users/938045579215380510",
          },
        ],
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="discord:component-embed"
          type="application/json"
          href="https://faarrel.my.id/discord-embed.json"
        />
        <script
          id="discord:component-embed"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(DISCORD_COMPONENT_EMBED),
          }}
        />
      </head>
      <body
        className="min-h-screen bg-[#121212] text-[#E0E0E0] font-sans selection:bg-[#E0E0E0] selection:text-[#121212]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
