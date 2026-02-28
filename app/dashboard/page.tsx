"use client";

import { useState, useCallback, useEffect, useRef, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import { Navbar } from "@/components/landing/Navbar";
import EnergyForm from "@/components/EnergyForm";
import AlertBox from "@/components/AlertBox";
import type { EnergyEntry } from "@/lib/analytics";
import {
  DEFAULT_THRESHOLD,
  DEFAULT_UNIT_PRICE,
  getThresholdAlerts,
  compareTrend,
  detectAnomalies,
} from "@/lib/analytics";
import { GlowButton } from "@/components/ui/GlowButton";

type UserSettings = { threshold: number; unitPrice: number };

const EnergyCharts = dynamic(() => import("@/components/EnergyCharts"), {
  ssr: false,
});

export default function DashboardPage() {
  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    threshold: DEFAULT_THRESHOLD,
    unitPrice: DEFAULT_UNIT_PRICE,
  });
  const [thresholdInput, setThresholdInput] = useState(String(DEFAULT_THRESHOLD));
  const [unitPriceInput, setUnitPriceInput] = useState(String(DEFAULT_UNIT_PRICE));
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [csvBusy, setCsvBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setSettings({
          threshold: data.threshold ?? DEFAULT_THRESHOLD,
          unitPrice: data.unitPrice ?? DEFAULT_UNIT_PRICE,
        });
        setThresholdInput(String(data.threshold ?? DEFAULT_THRESHOLD));
        setUnitPriceInput(String(data.unitPrice ?? DEFAULT_UNIT_PRICE));
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
    const price = parseFloat(unitPriceInput);
    if (isNaN(value) || value < 1 || value > 10000) {
      setError("Threshold must be between 1 and 10000.");
      return;
    }
    if (Number.isNaN(price) || price <= 0) {
      setError("Unit price must be a positive number.");
      return;
    }
    setError(null);
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threshold: value, unitPrice: price }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save settings");
        return;
      }
      const data = await res.json();
      setSettings({
        threshold: data.threshold ?? DEFAULT_THRESHOLD,
        unitPrice: data.unitPrice ?? DEFAULT_UNIT_PRICE,
      });
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

  const handleDownloadCsv = useCallback(() => {
    if (!entries.length) {
      setError("No entries to download yet.");
      return;
    }
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const header = "date,units\n";
    const rows = sorted.map((e) => `${e.date},${e.units}`);
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "energy-entries.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [entries]);

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setCsvBusy(true);
      setError(null);
      try {
        const text = await file.text();
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        if (!lines.length) {
          setError("CSV file is empty.");
          return;
        }
        let start = 0;
        if (lines[0].toLowerCase().startsWith("date")) {
          start = 1;
        }
        const toImport: EnergyEntry[] = [];
        for (let i = start; i < lines.length; i++) {
          const line = lines[i];
          const [dateRaw, unitsRaw] = line.split(",");
          if (!dateRaw || !unitsRaw) continue;
          const date = dateRaw.trim();
          const units = parseFloat(unitsRaw.trim());
          if (!date || Number.isNaN(units) || units <= 0) continue;
          toImport.push({ date, units });
        }
        if (!toImport.length) {
          setError("No valid rows found in CSV. Expect columns: date,units.");
          return;
        }
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toImport),
        });
        if (res.status === 401) {
          setError("Please sign in to import entries.");
          return;
        }
        if (res.status === 503) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Database not configured");
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Failed to import CSV");
          return;
        }
        // refresh from server so charts & alerts use latest data
        await fetchEntries();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to import CSV");
      } finally {
        setCsvBusy(false);
        e.target.value = "";
      }
    },
    [fetchEntries]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
          <div className="glass rounded-[20px] border border-slate-700/30 p-6 sm:p-7 hover:border-[#facc15]/40 hover:shadow-[0_0_40px_rgba(250,204,21,0.24)] transition-all duration-300">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Data (CSV)
            </h3>
            <p className="mb-5 text-base text-slate-400">
              Download your readings as <code className="text-slate-100">date,units</code> or
              import from a CSV file.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <GlowButton
                size="sm"
                variant="ghost"
                onClick={handleDownloadCsv}
              >
                Download CSV
              </GlowButton>
              <GlowButton
                size="sm"
                variant="secondary"
                onClick={handleUploadClick}
                className={csvBusy ? "opacity-70 pointer-events-none" : ""}
              >
                {csvBusy ? "Uploading…" : "Upload CSV"}
              </GlowButton>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="glass rounded-[20px] border border-slate-700/30 p-6 sm:p-7 hover:border-[#facc15]/40 hover:shadow-[0_0_40px_rgba(250,204,21,0.24)] transition-all duration-300">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Settings
            </h3>
            <p className="mb-5 text-base text-slate-400">
              Set your daily alert threshold and unit price so projected bills stay accurate.
            </p>
            <div className="flex flex-wrap items-end gap-6">
              <div className="min-w-[140px]">
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
                  className="h-11 w-28 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 text-base text-slate-50 outline-none transition focus:border-[#facc15]/40 focus:ring-2 focus:ring-[#facc15]/10"
                />
              </div>
              <div className="min-w-[160px]">
                <label
                  htmlFor="unitPrice"
                  className="mb-2 block text-sm font-medium text-slate-400"
                >
                  Unit price (₹/unit)
                </label>
                <input
                  id="unitPrice"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={unitPriceInput}
                  onChange={(e) => setUnitPriceInput(e.target.value)}
                  className="h-11 w-32 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 text-base text-slate-50 outline-none transition focus:border-[#facc15]/40 focus:ring-2 focus:ring-[#facc15]/10"
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
                {thresholdAlerts.map((alert, index) => (
                  <AlertBox
                    key={`${alert.date}-${alert.units}-${index}`}
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

          <EnergyCharts entries={entries} unitPrice={settings.unitPrice ?? DEFAULT_UNIT_PRICE} />
        </>
      </main>
    </>
  );
}
