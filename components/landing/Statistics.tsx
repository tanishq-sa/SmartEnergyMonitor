"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingDown, Cpu, Gauge } from "lucide-react";

const stats = [
  {
    icon: TrendingDown,
    value: 30,
    suffix: "%",
    label: "Energy Savings",
    color: "text-[#00ff88]",
  },
  {
    icon: Cpu,
    value: 10000,
    suffix: "+",
    label: "Devices Monitored",
    color: "text-[#00c3ff]",
  },
  {
    icon: Gauge,
    value: 99.9,
    suffix: "%",
    label: "Accuracy",
    color: "text-[#00ff88]",
  },
];

function AnimatedCounter({
  value,
  suffix,
  duration = 2,
  inView,
}: {
  value: number;
  suffix: string;
  duration?: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const startTime = Date.now();

    const update = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (end - start) * eased;
      setCount(isDecimal ? Math.round(current * 10) / 10 : Math.round(current));
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [value, duration, inView]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function Statistics() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-8"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-[20px] border border-slate-700/30 p-8 text-center hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.1)] transition-all duration-300"
            >
              <Icon
                className={`w-12 h-12 mx-auto mb-4 ${stat.color}`}
                strokeWidth={1.5}
              />
              <div className={`text-4xl sm:text-5xl font-bold text-slate-50 ${stat.color}`}>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="mt-2 text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          );
          })}
        </motion.div>
      </div>
    </section>
  );
}
