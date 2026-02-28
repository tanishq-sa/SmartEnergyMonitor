"use client";

import { useMemo, useState, FormEvent } from "react";
import type { EnergyEntry, Anomaly, TrendResult } from "@/lib/analytics";
import { calculateAverage, projectedMonthlyBill } from "@/lib/analytics";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type OptimizerChatProps = {
  entries: EnergyEntry[];
  threshold: number;
  unitPrice: number;
  trend: TrendResult;
  anomalies: Anomaly[];
};

export function OptimizerChat({
  entries,
  threshold,
  unitPrice,
  trend,
  anomalies,
}: OptimizerChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const snapshot = useMemo(() => {
    if (!entries.length) {
      return {
        avgDaily: 0,
        projected: 0,
      };
    }
    const avgDaily = calculateAverage(entries);
    const projected = projectedMonthlyBill(entries, unitPrice);
    return { avgDaily, projected };
  }, [entries, unitPrice]);

  function snapshotForApi() {
    const spikeCount = anomalies.filter((a) => a.type === "Spike").length;
    return {
      avgDaily: snapshot.avgDaily,
      projected: snapshot.projected,
      threshold,
      unitPrice,
      trend,
      spikeCount,
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/optimizer-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          snapshot: snapshotForApi(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorText =
          data?.error || "Something went wrong while talking to the optimizer assistant.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: errorText,
          },
        ]);
      } else {
        const data = (await res.json()) as { text: string };
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.text,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I couldn't reach the optimization service. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pointer-events-auto fixed bottom-4 right-4 z-40 w-full max-w-md sm:max-w-lg text-sm text-slate-100">
      <div className="glass rounded-[20px] border border-slate-700/40 bg-slate-950/90 p-5 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Optimizer assistant
            </p>
            <p className="text-[11px] text-slate-500">
              Suggestions based on your latest readings.
            </p>
          </div>
          {loading && (
            <p className="text-[11px] text-amber-300">Thinking…</p>
          )}
        </div>

        <div className="mb-4 max-h-72 space-y-2 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
              Ask things like “How can I reduce my bill?” or “Why is my usage increasing?” and I&apos;ll
              respond based on your current data.
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                m.role === "user"
                  ? "ml-auto max-w-[85%] bg-[#facc15]/10 text-[#fde68a]"
                  : "mr-auto max-w-[85%] bg-slate-900/80 text-slate-300"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about optimizing your usage…"
            className="h-10 flex-1 rounded-lg border border-slate-700/60 bg-slate-950/80 px-3 text-xs text-slate-100 outline-none focus:border-[#facc15]/60 focus:ring-1 focus:ring-[#facc15]/40"
            disabled={loading}
          />
          <button
            type="submit"
            className="h-10 rounded-lg bg-[#facc15] px-3 text-xs font-semibold text-slate-950 hover:bg-[#facc15]/90 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

