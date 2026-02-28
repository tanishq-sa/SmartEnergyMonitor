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
      className="rounded-lg border border-gray-800 bg-black/50 p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="mb-3 text-sm font-medium text-white">
        Add energy reading
      </h3>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="energy-date"
            className="mb-1 block text-xs text-gray-400"
          >
            Date
          </label>
          <input
            id="energy-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={disabled}
            className="w-full rounded border border-gray-700 bg-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 disabled:opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="energy-units"
            className="mb-1 block text-xs text-gray-400"
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
            className="w-32 rounded border border-gray-700 bg-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="rounded border border-gray-600 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-amber-400">{error}</p>
      )}
    </form>
  );
}
