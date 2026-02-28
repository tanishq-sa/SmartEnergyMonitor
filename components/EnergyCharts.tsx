"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import type { EnergyEntry } from "@/lib/analytics";
import {
  calculateTotal,
  calculateAverage,
  projectedMonthlyBill,
} from "@/lib/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      titleColor: "#f8fafc",
      bodyColor: "#e2e8f0",
      borderColor: "rgba(0, 255, 136, 0.25)",
      borderWidth: 1,
      titleFont: { size: 14, weight: "600" },
      bodyFont: { size: 13 },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(148, 163, 184, 0.12)" },
      ticks: { color: "#94a3b8", font: { size: 12 } },
    },
    y: {
      min: 0,
      grid: { color: "rgba(148, 163, 184, 0.12)" },
      ticks: { color: "#94a3b8", font: { size: 12 } },
    },
  },
};

type EnergyChartsProps = {
  entries: EnergyEntry[];
};

export default function EnergyCharts({ entries }: EnergyChartsProps) {
  // Aggregate by date so each day appears once (sum units for same date)
  const byDate = new Map<string, number>();
  for (const e of entries) {
    const key = e.date;
    byDate.set(key, (byDate.get(key) ?? 0) + e.units);
  }
  const sortedDates = [...byDate.keys()].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const labels = sortedDates.map((date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );
  const values = sortedDates.map((date) => byDate.get(date) ?? 0);

  const lineData = {
    labels,
    datasets: [
      {
        label: "Daily consumption",
        data: values,
        borderColor: "#00ff88",
        backgroundColor: "rgba(0, 255, 136, 0.10)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 4,
        pointBackgroundColor: "#00ff88",
      },
    ],
  };

  // Group by calendar week (Sunday–Saturday); one bar per week
  const getWeekStart = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d.toISOString().slice(0, 10);
  };
  const byWeek = new Map<string, number>();
  for (const date of sortedDates) {
    const weekKey = getWeekStart(date);
    byWeek.set(weekKey, (byWeek.get(weekKey) ?? 0) + (byDate.get(date) ?? 0));
  }
  const sortedWeeks = [...byWeek.keys()].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const weeklyBuckets: { label: string; total: number }[] = sortedWeeks.map((weekStart) => {
    const d = new Date(weekStart + "T12:00:00");
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    const label =
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " – " +
      end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { label, total: byWeek.get(weekStart) ?? 0 };
  });
  if (weeklyBuckets.length === 0) {
    weeklyBuckets.push({ label: "No data", total: 0 });
  }

  const barData = {
    labels: weeklyBuckets.map((w) => w.label),
    datasets: [
      {
        label: "Weekly total",
        data: weeklyBuckets.map((w) => w.total),
        backgroundColor: "rgba(0, 195, 255, 0.25)",
        borderColor: "rgba(0, 195, 255, 0.55)",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const total = calculateTotal(entries);
  const avg = calculateAverage(entries);
  const projected = projectedMonthlyBill(entries);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Summary
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass rounded-[20px] border border-slate-700/30 p-6 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)] transition-all duration-300">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Total units</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-50">
              {total.toFixed(1)}
            </p>
          </div>
          <div className="glass rounded-[20px] border border-slate-700/30 p-6 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)] transition-all duration-300">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Avg per day</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-50">
              {avg.toFixed(1)}
            </p>
          </div>
          <div className="glass rounded-[20px] border border-slate-700/30 p-6 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)] transition-all duration-300">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Projected monthly bill</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-50">
              ₹{projected}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Daily consumption
        </h3>
        <div className="glass rounded-[20px] border border-slate-700/30 p-6 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)] transition-all duration-300">
          <div className="h-72">
            {entries.length > 0 ? (
              <Line data={lineData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700/60 text-base text-slate-500">
                Add entries to see the line chart
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Weekly total
        </h3>
        <div className="glass rounded-[20px] border border-slate-700/30 p-6 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)] transition-all duration-300">
          <div className="h-72">
            {entries.length > 0 ? (
              <Bar data={barData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700/60 text-base text-slate-500">
                Add entries to see the bar chart
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
