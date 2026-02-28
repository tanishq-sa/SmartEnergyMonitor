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
  },
  scales: {
    x: {
      grid: { color: "rgba(75, 85, 99, 0.2)" },
      ticks: { color: "#9ca3af" },
    },
    y: {
      min: 0,
      grid: { color: "rgba(75, 85, 99, 0.2)" },
      ticks: { color: "#9ca3af" },
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
        borderColor: "#e5e7eb",
        backgroundColor: "rgba(229, 231, 235, 0.1)",
        fill: true,
        tension: 0.3,
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
        backgroundColor: "rgba(156, 163, 175, 0.6)",
        borderColor: "#9ca3af",
        borderWidth: 1,
      },
    ],
  };

  const total = calculateTotal(entries);
  const avg = calculateAverage(entries);
  const projected = projectedMonthlyBill(entries);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
          Summary
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800/90 bg-gray-900/40 p-5 shadow-lg shadow-black/10 ring-1 ring-white/5 transition hover:border-gray-700/80">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total units</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {total.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800/90 bg-gray-900/40 p-5 shadow-lg shadow-black/10 ring-1 ring-white/5 transition hover:border-gray-700/80">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Avg per day</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {avg.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800/90 bg-gray-900/40 p-5 shadow-lg shadow-black/10 ring-1 ring-white/5 transition hover:border-gray-700/80">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Projected monthly bill</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              ₹{projected}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
          Daily consumption
        </h3>
        <div className="rounded-xl border border-gray-800/90 bg-gray-900/40 p-5 shadow-lg shadow-black/10 ring-1 ring-white/5 transition hover:border-gray-700/80">
          <div className="h-72">
            {entries.length > 0 ? (
              <Line data={lineData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-500">
                Add entries to see the line chart
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">
          Weekly total
        </h3>
        <div className="rounded-xl border border-gray-800/90 bg-gray-900/40 p-5 shadow-lg shadow-black/10 ring-1 ring-white/5 transition hover:border-gray-700/80">
          <div className="h-72">
            {entries.length > 0 ? (
              <Bar data={barData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-500">
                Add entries to see the bar chart
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
