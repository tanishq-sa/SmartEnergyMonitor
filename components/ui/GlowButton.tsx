"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

const variants = {
  primary: "bg-[#00ff88] text-[#0f172a] hover:shadow-[0_0_40px_rgba(0,255,136,0.5)] border-[#00ff88]/50",
  secondary: "border border-[#00c3ff]/50 text-[#00c3ff] hover:bg-[#00c3ff]/10 hover:shadow-[0_0_30px_rgba(0,195,255,0.3)]",
  ghost: "border border-slate-600/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800/30",
};

const sizes = {
  sm: "h-10 px-4 text-sm gap-2",
  md: "h-12 px-6 text-base gap-2",
  lg: "h-14 px-8 text-lg gap-3",
};

export function GlowButton({
  children,
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  onClick,
  type = "button",
  className = "",
}: GlowButtonProps) {
  const baseClass = `inline-flex items-center justify-center font-semibold rounded-[20px] transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      {children}
    </>
  );

  const MotionButton = motion.button;
  const MotionLink = motion(Link);

  if (href) {
    return (
      <MotionLink
        href={href}
        className={baseClass}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <MotionButton
      type={type}
      onClick={onClick}
      className={baseClass}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {content}
    </MotionButton>
  );
}
