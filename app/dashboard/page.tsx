"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EnergyForm from "@/components/EnergyForm";
import EnergyCharts from "@/components/EnergyCharts";
import AlertBox from "@/components/AlertBox";
import type { EnergyEntry } from "@/lib/analytics";
import {
  getHighConsumptionEntries,
  compareTrend,
  detectAnomalies,
} from "@/lib/analytics";

export default function DashboardPage() {
  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/entries");
      if (res.status === 401) {
        setEntries([]);
        return;
      }
      if (res.status === 503) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Database not configured");
        setEntries([]);
        return;
      }
      if (!res.ok) throw new Error("Failed to load entries");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries");
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleAdd = useCallback(
    async (entry: EnergyEntry) => {
      setError(null);
      try {
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (res.status === 401) {
          setError("Please sign in to save entries.");
          return;
        }
        if (res.status === 503) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Database not configured");
          return;
        }
        if (!res.ok) throw new Error("Failed to save");
        setEntries((prev) => [...prev, entry]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save entry");
      }
    },
    []
  );

  const highConsumption = getHighConsumptionEntries(entries);
  const trend = compareTrend(entries);
  const anomalies = detectAnomalies(entries);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-white">
          Dashboard
        </h2>

        {error && (
          <div className="mb-4">
            <AlertBox message={error} variant="warning" />
          </div>
        )}

        <div className="mb-8">
          <EnergyForm onAdd={handleAdd} />
        </div>

        <>
          {highConsumption.length > 0 && (
              <div className="mb-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  Threshold alerts
                </h3>
                {highConsumption.map((e) => (
                  <AlertBox
                    key={e.date}
                    message={`High consumption detected on ${new Date(e.date).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })} (${e.units} units)`}
                    variant="warning"
                  />
                ))}
              </div>
            )}

            {trend && (
              <div className="mb-6">
                <AlertBox
                  message={trend}
                  variant={trend === "Usage Improving" ? "success" : "warning"}
                />
              </div>
            )}

            {anomalies.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-gray-400">
                  Anomaly insights
                </h3>
                <div className="space-y-2">
                  {anomalies.map((a, i) => (
                    <AlertBox
                      key={`${a.date}-${a.type}-${i}`}
                      message={`${a.type} on ${new Date(a.date).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}`}
                      variant="info"
                    />
                  ))}
                </div>
              </div>
            )}

          <EnergyCharts entries={entries} />
        </>
      </main>
    </div>
  );
}
