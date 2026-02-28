"use client";

type AlertBoxProps = {
  message: string;
  variant?: "warning" | "info" | "success";
};

export default function AlertBox({
  message,
  variant = "warning",
}: AlertBoxProps) {
  const border =
    variant === "warning"
      ? "border-amber-500/50"
      : variant === "success"
        ? "border-emerald-500/50"
        : "border-gray-600";

  return (
    <div
      className={`rounded-lg border bg-black/50 px-4 py-3 shadow-sm transition-shadow hover:shadow-md ${border}`}
    >
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );
}
