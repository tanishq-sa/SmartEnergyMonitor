"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EnergyForm from "@/components/EnergyForm";
import EnergyCharts from "@/components/EnergyCharts";
import AlertBox from "@/components/AlertBox";
import type { EnergyEntry } from "@/lib/analytics";
import { DEFAULT_THRESHOLD, getThresholdAlerts, compareTrend, detectAnomalies } from "@/lib/analytics";

type UserSettings = { threshold: number };

export default function DashboardPage() {
  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ threshold: DEFAULT_THRESHOLD });
  const [thresholdInput, setThresholdInput] = useState(String(DEFAULT_THRESHOLD));
  const [settingsSaving, setSettingsSaving] = useState(false);
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

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setThresholdInput(String(data.threshold ?? DEFAULT_THRESHOLD));
      }
    } catch {
      // keep default
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = useCallback(async () => {
    const value = parseInt(thresholdInput, 10);
    if (isNaN(value) || value < 1 || value > 10000) {
      setError("Threshold must be between 1 and 10000.");
      return;
    }
    setError(null);
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threshold: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save settings");
        return;
      }
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSettingsSaving(false);
    }
  }, [thresholdInput]);

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

  const threshold = settings.threshold ?? DEFAULT_THRESHOLD;
  const thresholdAlerts = getThresholdAlerts(entries, threshold);
  const trend = compareTrend(entries);
  const anomalies = detectAnomalies(entries);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-gray-500">
            Track usage, set your threshold, and view insights.
          </p>
        </header>

        {error && (
          <div className="mb-6">
            <AlertBox message={error} variant="warning" />
          </div>
        )}

        <section className="mb-10">
          <EnergyForm onAdd={handleAdd} />
        </section>

        <section className="mb-10">
          <div className="rounded-xl border border-gray-800/90 bg-gray-900/40 p-5 shadow-lg shadow-black/10 ring-1 ring-white/5 transition hover:border-gray-700/80">
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Settings
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Daily alert threshold (units). Alerts when a day&apos;s usage exceeds this value.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <input
                id="threshold"
                type="number"
                min={1}
                max={10000}
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                className="h-11 w-24 rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
              />
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                className="h-11 rounded-lg bg-white px-5 text-sm font-medium text-black shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
              >
                {settingsSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </section>

        <>
          {thresholdAlerts.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Threshold alerts · limit {threshold} units
              </h3>
              <div className="space-y-3">
                {thresholdAlerts.map((alert) => (
                  <AlertBox
                    key={alert.date}
                    message={`High consumption on ${new Date(alert.date).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })} — ${alert.units} units (threshold: ${alert.threshold})`}
                    reason={alert.reason}
                    variant="warning"
                  />
                ))}
              </div>
            </section>
          )}

          {trend && (
            <section className="mb-8">
              <AlertBox
                message={trend}
                variant={trend === "Usage Improving" ? "success" : "warning"}
              />
            </section>
          )}

          {anomalies.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Anomaly insights
              </h3>
              <div className="space-y-3">
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
            </section>
          )}

          <EnergyCharts entries={entries} />
        </>
      </main>
    </div>
  );
}
