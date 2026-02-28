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
      grid: { color: "rgba(75, 85, 99, 0.2)" },
      ticks: { color: "#9ca3af" },
    },
  },
};

type EnergyChartsProps = {
  entries: EnergyEntry[];
};

export default function EnergyCharts({ entries }: EnergyChartsProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const labels = sorted.map((e) =>
    new Date(e.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );
  const values = sorted.map((e) => e.units);

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

  const weeklyBuckets: { label: string; total: number }[] = [];
  if (sorted.length > 0) {
    const copy = [...sorted];
    for (let i = 0; i < copy.length; i += 7) {
      const chunk = copy.slice(i, i + 7);
      const total = chunk.reduce((s, e) => s + e.units, 0);
      weeklyBuckets.push({
        label:
          chunk.length > 0
            ? new Date(chunk[0].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }) + " (week)"
            : `Week ${i / 7 + 1}`,
        total,
      });
    }
  }
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
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-800 bg-black/50 p-4 transition-shadow hover:shadow-md">
          <p className="text-xs text-gray-400">Total units</p>
          <p className="text-xl font-semibold text-white">
            {total.toFixed(1)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/50 p-4 transition-shadow hover:shadow-md">
          <p className="text-xs text-gray-400">Avg per day</p>
          <p className="text-xl font-semibold text-white">
            {avg.toFixed(1)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/50 p-4 transition-shadow hover:shadow-md">
          <p className="text-xs text-gray-400">Projected monthly bill</p>
          <p className="text-xl font-semibold text-white">
            ₹{projected}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-800 bg-black/50 p-4 transition-shadow hover:shadow-md">
        <h3 className="mb-3 text-sm font-medium text-white">
          Daily consumption
        </h3>
        <div className="h-64">
          {entries.length > 0 ? (
            <Line data={lineData} options={chartOptions} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Add entries to see the line chart
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-800 bg-black/50 p-4 transition-shadow hover:shadow-md">
        <h3 className="mb-3 text-sm font-medium text-white">
          Weekly total
        </h3>
        <div className="h-64">
          {entries.length > 0 ? (
            <Bar data={barData} options={chartOptions} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Add entries to see the bar chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
