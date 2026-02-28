"use client";

import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function CTASection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[20px] border border-[#facc15]/35 p-12 sm:p-16 text-center relative overflow-hidden"
        >
          {/* Glow behind */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(250,204,21,0.22) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50">
              Start Saving Energy Today
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
              Join thousands of users reducing their carbon footprint and energy
              bills. Get started in under a minute.
            </p>
            <div className="mt-8">
              <SignedOut>
                <GlowButton href="/sign-up" variant="primary" size="lg">
                  Get Started — It&apos;s Free
                </GlowButton>
              </SignedOut>
              <SignedIn>
                <GlowButton href="/dashboard" variant="primary" size="lg">
                  Go to Dashboard
                </GlowButton>
              </SignedIn>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
