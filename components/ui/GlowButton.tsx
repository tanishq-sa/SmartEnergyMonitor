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
  primary:
    "bg-gradient-to-r from-[#00ff88] to-[#a855f7] text-white hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] border-[#a855f7]/60",
  secondary:
    "border border-[#00c3ff]/60 text-[#93c5fd] hover:bg-[#00c3ff]/15 hover:shadow-[0_0_35px_rgba(0,195,255,0.4)]",
  ghost: "border border-slate-600/50 text-slate-300 hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]",
};

const sizes = {
  sm: "h-10 px-4 text-sm gap-2",
  md: "h-12 px-6 text-base gap-2",
  lg: "h-14 px-8 text-lg gap-3",
};

const MotionButton = motion.button;
const MotionLink = motion(Link);

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
