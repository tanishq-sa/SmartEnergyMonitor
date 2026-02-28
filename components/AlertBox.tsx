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
      ? "glass border border-amber-400/20"
      : variant === "success"
        ? "glass border border-[#00ff88]/20"
        : "glass border border-[#00c3ff]/20";

  const accent =
    variant === "warning"
      ? "bg-amber-400/80"
      : variant === "success"
        ? "bg-[#00ff88]/80"
        : "bg-[#00c3ff]/80";

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] px-4 py-3.5 shadow-sm transition hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] ${styles}`}
    >
      <span className={`absolute left-0 top-0 h-full w-1.5 ${accent}`} />
      <p className="pl-2 text-base font-semibold text-slate-100">{message}</p>
      {reason && (
        <p className="mt-2 pl-2 text-sm leading-relaxed text-slate-400">{reason}</p>
      )}
    </div>
  );
}
