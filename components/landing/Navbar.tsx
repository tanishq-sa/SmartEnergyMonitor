"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#facc15] to-[#f97316] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(250,204,21,0.45)] transition-shadow">
              <Zap className="w-5 h-5 text-[#0f172a]" />
            </div>
            <span className="text-lg font-semibold text-slate-50">
              SmartEnergy
            </span>
          </Link>

          {/* Nav links + user avatar */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden sm:block text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors"
              >
                Sign in
              </Link>
              <GlowButton href="/sign-up" variant="primary" size="sm">
                Get Started
              </GlowButton>
            </SignedOut>
            <SignedIn>
              <GlowButton href="/dashboard" variant="primary" size="sm">
                Dashboard
              </GlowButton>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 border border-slate-600/60 shadow-sm hover:border-[#facc15]/60 transition",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
