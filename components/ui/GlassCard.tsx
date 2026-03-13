"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "blue" | "green" | "none";
  hover?: boolean;
}

const glowStyles = {
  purple:
    "border-[#a855f7]/40 hover:border-[#a855f7]/70 hover:shadow-[0_0_50px_rgba(168,85,247,0.35)]",
  blue:
    "border-[#00c3ff]/40 hover:border-[#00c3ff]/70 hover:shadow-[0_0_50px_rgba(0,195,255,0.35)]",
  green:
    "border-[#00ff88]/40 hover:border-[#00ff88]/70 hover:shadow-[0_0_50px_rgba(0,255,136,0.35)]",
  none: "border-slate-700/30",
};

export function GlassCard({
  children,
  className = "",
  glow = "yellow",
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`glass rounded-[20px] p-6 border transition-all duration-300 ${glowStyles[glow]} ${hover ? "hover:-translate-y-1" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
