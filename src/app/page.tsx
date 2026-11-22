import ImmersiveFullscreenNav from '@/components/ui/immersive-full-screen-nav';
import Hero from '@/components/Hero';
import BentoSection from '@/components/BentoSection';
import ContactSection from '@/components/ContactSection';
import SmoothScroll from '@/components/SmoothScroll';
import { GridPattern } from '@/components/ui/grid-pattern';

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#121212] text-[#E0E0E0] relative selection:bg-[#E0E0E0] selection:text-[#121212]">
        {/* Soft Vignette Grid Pattern wrapping content: generous uniform squares, subdued soft mouse glow */}
        <GridPattern
          fade="vignette"
          majorEvery={0}
          size={64}
          color="rgba(255, 255, 255, 0.05)"
          accentColor="rgba(255, 255, 255, 0.35)"
          radius={180}
          className="w-full min-h-screen"
        >
          <div className="relative z-10">
            <ImmersiveFullscreenNav />
            <Hero />
            <BentoSection />
            <ContactSection />
          </div>
        </GridPattern>
      </main>
    </SmoothScroll>
  );
}
