"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "green" | "blue" | "both" | "none";
  hover?: boolean;
}

const glowStyles = {
  green: "border-[#00ff88]/20 hover:border-[#00ff88]/40 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]",
  blue: "border-[#00c3ff]/20 hover:border-[#00c3ff]/40 hover:shadow-[0_0_30px_rgba(0,195,255,0.15)]",
  both: "border-[#00ff88]/15 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.1),0_0_30px_rgba(0,195,255,0.1)]",
  none: "border-slate-700/30",
};

export function GlassCard({
  children,
  className = "",
  glow = "both",
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
