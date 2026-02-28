export type EnergyEntry = {
  date: string;
  units: number;
};

export type Anomaly = {
  date: string;
  type: "Spike" | "Consistent Rise";
};

export function calculateTotal(entries: EnergyEntry[]): number {
  return entries.reduce((sum, e) => sum + e.units, 0);
}

export function calculateAverage(entries: EnergyEntry[]): number {
  if (entries.length === 0) return 0;
  return calculateTotal(entries) / entries.length;
}

export type TrendResult = "Usage Increasing" | "Usage Improving" | null;

export function compareTrend(entries: EnergyEntry[]): TrendResult {
  if (entries.length < 6) return null;
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const last3 = sorted.slice(-3);
  const prev3 = sorted.slice(-6, -3);
  const lastAvg =
    last3.reduce((s, e) => s + e.units, 0) / last3.length;
  const prevAvg =
    prev3.reduce((s, e) => s + e.units, 0) / prev3.length;
  if (prevAvg === 0) return null;
  const change = (lastAvg - prevAvg) / prevAvg;
  if (change > 0.2) return "Usage Increasing";
  if (change < -0.2) return "Usage Improving";
  return null;
}

export function detectAnomalies(entries: EnergyEntry[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  if (entries.length === 0) return anomalies;

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const avg = calculateAverage(entries);

  for (let i = 0; i < sorted.length; i++) {
    const e = sorted[i];
    if (avg > 0 && e.units > 1.5 * avg) {
      anomalies.push({ date: e.date, type: "Spike" });
    }
  }

  if (sorted.length >= 3) {
    for (let i = 2; i < sorted.length; i++) {
      const u0 = sorted[i - 2].units;
      const u1 = sorted[i - 1].units;
      const u2 = sorted[i].units;
      if (u1 > u0 && u2 > u1) {
        anomalies.push({
          date: sorted[i].date,
          type: "Consistent Rise",
        });
      }
    }
  }

  return anomalies;
}

export const DEFAULT_THRESHOLD = 50;

export type ThresholdAlert = {
  date: string;
  units: number;
  threshold: number;
  reason: string;
};

export function getHighConsumptionEntries(
  entries: EnergyEntry[],
  threshold: number = DEFAULT_THRESHOLD
): EnergyEntry[] {
  return entries.filter((e) => e.units > threshold);
}

/** Returns threshold alerts with a clear reason for each. */
export function getThresholdAlerts(
  entries: EnergyEntry[],
  threshold: number = DEFAULT_THRESHOLD
): ThresholdAlert[] {
  return entries
    .filter((e) => e.units > threshold)
    .map((e) => {
      const over = e.units - threshold;
      const pct = Math.round((over / threshold) * 100);
      const reason =
        pct >= 100
          ? `Exceeded daily threshold (${threshold} units) by ${over} units (${pct}% over). Consider checking for leaks or heavy appliances.`
          : pct >= 50
            ? `Exceeded daily threshold (${threshold} units) by ${over} units (${pct}% over).`
            : `Exceeded daily threshold of ${threshold} units by ${over} units.`;
      return {
        date: e.date,
        units: e.units,
        threshold,
        reason,
      };
    });
}

const RATE_PER_UNIT = 6;

export function projectedMonthlyBill(entries: EnergyEntry[]): number {
  if (entries.length === 0) return 0;
  const avgDaily = calculateAverage(entries);
  return Math.round(avgDaily * 30 * RATE_PER_UNIT);
}
