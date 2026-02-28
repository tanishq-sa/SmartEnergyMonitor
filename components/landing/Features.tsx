"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  DollarSign,
  Leaf,
  LucideIcon,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const features = [
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Track energy consumption live across all your devices. Instant updates and detailed breakdowns.",
    glow: "green" as const,
  },
  {
    icon: Brain,
    title: "AI Energy Insights",
    description: "Get intelligent recommendations to reduce usage. Anomaly detection and smart alerts.",
    glow: "blue" as const,
  },
  {
    icon: DollarSign,
    title: "Cost Tracking",
    description: "Monitor your energy spend in real-time. Set budgets and get notified when thresholds are exceeded.",
    glow: "green" as const,
  },
  {
    icon: Leaf,
    title: "Carbon Footprint Analytics",
    description: "Measure your environmental impact. Track CO2 savings and contribute to sustainability goals.",
    glow: "blue" as const,
  },
];

export function Features() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8" id="features">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-50">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-[#00ff88] to-[#00c3ff] bg-clip-text text-transparent">
              save energy
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Powerful features designed for homes and businesses.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  glow,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  glow: "green" | "blue";
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassCard glow={glow} hover>
        <div className="flex flex-col h-full">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              glow === "green"
                ? "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20"
                : "bg-[#00c3ff]/10 text-[#00c3ff] border border-[#00c3ff]/20"
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-50 mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed flex-1">
            {description}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
