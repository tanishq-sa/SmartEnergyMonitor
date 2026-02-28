"use client";

import { useState, FormEvent } from "react";
import type { EnergyEntry } from "@/lib/analytics";
import { GlowButton } from "@/components/ui/GlowButton";

type EnergyFormProps = {
  onAdd: (entry: EnergyEntry) => void | Promise<void>;
  disabled?: boolean;
};

export default function EnergyForm({ onAdd, disabled }: EnergyFormProps) {
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [units, setUnits] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const u = parseFloat(units);
    if (!date) {
      setError("Date is required.");
      return;
    }
    if (isNaN(u) || u <= 0) {
      setError("Units must be a number greater than 0.");
      return;
    }
    await Promise.resolve(onAdd({ date, units: u }));
    setUnits("");
    setDate(new Date().toISOString().slice(0, 10));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-[20px] border border-slate-700/30 p-6 sm:p-7 hover:border-[#00ff88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)] transition-all duration-300"
    >
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Add energy reading
      </h3>
      <p className="mb-5 text-base text-slate-400">
        Log a new meter reading by date and units consumed.
      </p>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="energy-date"
            className="mb-2 block text-sm font-medium text-slate-400"
          >
            Date
          </label>
          <input
            id="energy-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={disabled}
            className="h-11 min-w-[160px] rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 text-base text-slate-50 outline-none transition focus:border-[#00ff88]/40 focus:ring-2 focus:ring-[#00ff88]/10 disabled:opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="energy-units"
            className="mb-2 block text-sm font-medium text-slate-400"
          >
            Units consumed
          </label>
          <input
            id="energy-units"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="e.g. 25"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            disabled={disabled}
            className="h-11 w-40 rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 text-base text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-[#00ff88]/40 focus:ring-2 focus:ring-[#00ff88]/10 disabled:opacity-50"
          />
        </div>
        <GlowButton
          type="submit"
          size="sm"
          variant="primary"
          className={disabled ? "opacity-70 pointer-events-none" : ""}
        >
          Add
        </GlowButton>
      </div>
      {error && (
        <p className="mt-4 text-sm text-amber-300">{error}</p>
      )}
    </form>
  );
}
