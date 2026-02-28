"use client";

import { useState, FormEvent } from "react";
import type { EnergyEntry } from "@/lib/analytics";

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
      className="rounded-xl border border-gray-800/90 bg-gray-900/40 p-5 shadow-lg shadow-black/10 ring-1 ring-white/5 transition hover:border-gray-700/80"
    >
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
        Add energy reading
      </h3>
      <p className="mb-4 text-sm text-gray-400">
        Log a new meter reading by date and units consumed.
      </p>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="energy-date"
            className="mb-1.5 block text-xs font-medium text-gray-400"
          >
            Date
          </label>
          <input
            id="energy-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={disabled}
            className="h-11 min-w-[140px] rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="energy-units"
            className="mb-1.5 block text-xs font-medium text-gray-400"
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
            className="h-11 w-32 rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="h-11 rounded-lg bg-white px-5 text-sm font-medium text-black shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {error && (
        <p className="mt-3 text-xs text-amber-400">{error}</p>
      )}
    </form>
  );
}
