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
    icon: "/logo.webp",
    shortcut: "/logo.webp",
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
      <body
        className="min-h-screen bg-[#121212] text-[#E0E0E0] font-sans selection:bg-[#E0E0E0] selection:text-[#121212]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
