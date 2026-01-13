import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DestinationsMap } from "@/components/landing/DestinationsMap";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import { ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <DestinationsMap />
      <FeaturesGrid />
      <Testimonials />

      {/* Simple Footer for MVP */}
      <footer className="bg-deep-teak text-warm-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-heading font-bold">ITINARA</div>
          <div className="flex gap-8 text-sm opacity-80">
            <Link href="#" className="hover:text-sunrise-gold transition-colors">Destinations</Link>
            <Link href="#" className="hover:text-sunrise-gold transition-colors">About Us</Link>
            <Link href="#" className="hover:text-sunrise-gold transition-colors">Community</Link>
            <Link href="#" className="hover:text-sunrise-gold transition-colors">Login</Link>
          </div>
          <div className="text-xs opacity-50">
            © 2026 ITINARA. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
