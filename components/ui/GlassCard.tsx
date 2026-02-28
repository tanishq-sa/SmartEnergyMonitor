"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "yellow" | "none";
  hover?: boolean;
}

const glowStyles = {
  yellow:
    "border-[#facc15]/40 hover:border-[#facc15]/70 hover:shadow-[0_0_40px_rgba(250,204,21,0.28)]",
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
