"use client";

import { motion } from "framer-motion";

/** Enhanced animated grid and energy wave background with purple accents */
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0a0b1e]" />

      {/* Radial glow orbs (enhanced with purple) */}
      <motion.div
        className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#00ff88]/8 to-[#a855f7]/8 blur-[140px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#00c3ff]/10 to-[#ec4899]/10 blur-[120px]"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.4, 0.6, 0.4],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#a855f7]/6 blur-[100px]"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern - enhanced */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Energy wave lines - enhanced */}
      <svg className="absolute inset-0 w-full h-full opacity-12" preserveAspectRatio="none">
        <motion.path
          d="M0,200 Q400,100 800,200 T1600,200"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          strokeDasharray="12 12"
          animate={{ strokeDashoffset: [0, 36] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0,300 Q400,200 800,300 T1600,300"
          fill="none"
          stroke="url(#waveGradient2)"
          strokeWidth="1.5"
          strokeDasharray="8 16"
          animate={{ strokeDashoffset: [36, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00c3ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00c3ff" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#a855f7]/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0,400 Q400,300 800,400 T1600,400"
          fill="none"
          stroke="#f97316"
          strokeWidth="1"
          strokeDasharray="8 8"
          animate={{ strokeDashoffset: [24, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
