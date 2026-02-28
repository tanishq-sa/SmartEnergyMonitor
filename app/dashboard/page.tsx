"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import { Navbar } from "@/components/landing/Navbar";
import EnergyForm from "@/components/EnergyForm";
import EnergyCharts from "@/components/EnergyCharts";
import AlertBox from "@/components/AlertBox";
import type { EnergyEntry } from "@/lib/analytics";
import { DEFAULT_THRESHOLD, getThresholdAlerts, compareTrend, detectAnomalies } from "@/lib/analytics";
import { GlowButton } from "@/components/ui/GlowButton";

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
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
            Dashboard
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Log readings, tune your threshold, and monitor trends.
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
          <div className="glass rounded-[20px] border border-slate-700/30 p-6 sm:p-7 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)] transition-all duration-300">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Settings
            </h3>
            <p className="mb-5 text-base text-slate-400">
              Set your daily alert threshold (units). We&apos;ll flag days that exceed it.
            </p>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor="threshold"
                  className="mb-2 block text-sm font-medium text-slate-400"
                >
                  Daily threshold
                </label>
                <input
                  id="threshold"
                  type="number"
                  min={1}
                  max={10000}
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  className="h-11 w-28 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 text-base text-slate-50 outline-none transition focus:border-[#00ff88]/40 focus:ring-2 focus:ring-[#00ff88]/10"
                />
              </div>
              <GlowButton
                onClick={handleSaveSettings}
                type="button"
                size="sm"
                variant="primary"
                className={settingsSaving ? "opacity-70 pointer-events-none" : ""}
              >
                {settingsSaving ? "Saving…" : "Save"}
              </GlowButton>
            </div>
          </div>
        </section>

        <>
          {thresholdAlerts.length > 0 && (
            <section className="mb-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Threshold alerts · limit {threshold} units/day
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
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
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
    </>
  );
}
