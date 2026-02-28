import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Statistics } from "@/components/landing/Statistics";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Statistics />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
