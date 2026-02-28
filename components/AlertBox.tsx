"use client";

type AlertBoxProps = {
  message: string;
  reason?: string;
  variant?: "warning" | "info" | "success";
};

export default function AlertBox({
  message,
  reason,
  variant = "warning",
}: AlertBoxProps) {
  const styles =
    variant === "warning"
      ? "border-l-4 border-l-amber-500/80 border border-gray-800/90 bg-amber-950/20"
      : variant === "success"
        ? "border-l-4 border-l-emerald-500/80 border border-gray-800/90 bg-emerald-950/20"
        : "border-l-4 border-l-gray-500/80 border border-gray-800/90 bg-gray-900/40";

  return (
    <div
      className={`rounded-xl px-4 py-3.5 shadow-sm ring-1 ring-white/5 transition hover:shadow-md ${styles}`}
    >
      <p className="text-sm font-medium text-gray-200">{message}</p>
      {reason && (
        <p className="mt-2 text-xs leading-relaxed text-gray-400">{reason}</p>
      )}
    </div>
  );
}
