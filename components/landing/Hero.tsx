"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Play } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl text-center"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 rounded-full glass border border-[#00ff88]/20 px-4 py-2 mb-8"
        >
          <Zap className="w-4 h-4 text-[#00ff88]" />
          <span className="text-sm font-medium text-slate-300">
            Smart Energy Tracking
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
        >
          <span className="text-slate-50">Monitor. </span>
          <span className="bg-gradient-to-r from-[#00ff88] to-[#00c3ff] bg-clip-text text-transparent">
            Optimize.
          </span>
          <br />
          <span className="text-slate-50">Save Energy.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={item}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Take control of your energy consumption with real-time monitoring,
          AI-powered insights, and smart alerts. Reduce costs and your carbon
          footprint.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <SignedOut>
            <GlowButton href="/sign-up" variant="primary" size="lg">
              Get Started
            </GlowButton>
            <GlowButton href="/sign-in" variant="secondary" size="lg" icon={Play}>
              Live Demo
            </GlowButton>
          </SignedOut>
          <SignedIn>
            <GlowButton href="/dashboard" variant="primary" size="lg">
              Go to Dashboard
            </GlowButton>
          </SignedIn>
        </motion.div>

        {/* Dashboard mockup preview */}
        <motion.div
          variants={item}
          className="mt-16 relative"
        >
          <div className="glass rounded-[20px] border border-[#00ff88]/20 p-2 sm:p-4 shadow-[0_0_60px_rgba(0,255,136,0.1)]">
            {/* Mock chart bars */}
            <div className="h-48 sm:h-64 rounded-xl bg-slate-800/50 flex items-end justify-around gap-2 p-4">
              {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-[#00ff88]/30 to-[#00c3ff]/30 min-w-[24px] max-w-[48px]"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                  style={{ boxShadow: "0 0 20px rgba(0,255,136,0.2)" }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          {/* Glow behind mockup */}
          <div
            className="absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-3xl"
            style={{ background: "linear-gradient(135deg, #00ff88 0%, #00c3ff 100%)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
