import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Faarrel | Graphic Designer, Character Animator & Fullstack Developer",
  description: "Portfolio of Faarrel: Graphic design (Photoshop, Alight Motion), character animation & puppet motion (After Effects), Discord server architecture, and fullstack development (Next.js & discord.js/discord.py).",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
    type: "website",
    locale: "en_US",
    images: ["/logo.png"],
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
