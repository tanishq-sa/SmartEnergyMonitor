"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00c3ff] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#0f172a]" />
            </div>
            <span className="text-lg font-semibold text-slate-50">
              SmartEnergy Monitor
            </span>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full glass border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-[#00ff88] hover:border-[#00ff88]/30 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-slate-800/50 text-center text-sm text-slate-500"
        >
          © {new Date().getFullYear()} SmartEnergy Monitor. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
