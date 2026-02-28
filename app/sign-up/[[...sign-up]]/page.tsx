"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk-appearance";

/** Premium glassmorphism sign-up page matching login design */
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-16">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0f172a]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#facc15]/8 blur-[110px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#f97316]/10 blur-[90px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250,204,21,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250,204,21,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#facc15] to-[#f97316] flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-shadow">
            <Zap className="w-6 h-6 text-[#0f172a]" />
          </div>
          <span className="text-xl font-semibold text-slate-50">
            SmartEnergy Monitor
          </span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-[420px] glass rounded-[20px] border border-[#facc15]/35 p-6 sm:p-8 shadow-[0_0_60px_rgba(250,204,21,0.20)] clerk-auth-page"
      >
        <SignUp
          appearance={clerkAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-sm text-slate-500"
      >
        <Link href="/" className="hover:text-[#facc15] transition-colors">
          ← Back to home
        </Link>
      </motion.p>
    </div>
  );
}
