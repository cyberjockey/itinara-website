import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { DestinationsMapLazy } from "@/components/landing/DestinationsMapLazy";

export default function Home() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Hero />
      <section id="about">
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
      </section>

      <section id="destinations">
        <ScrollReveal delay={0.2}>
          <DestinationsMapLazy />
        </ScrollReveal>
      </section>

      <section id="itineraries">
        <ScrollReveal>
          <FeaturesGrid />
        </ScrollReveal>
      </section>

      <section id="community">
        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>
      </section>
    </main>
  );
}
