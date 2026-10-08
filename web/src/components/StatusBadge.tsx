export default function StatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "md" | "sm";
}) {
  const positive = ["Paid", "Completed", "Active"].includes(status);
  const pending = status === "Pending";
  const negative = ["Inactive", "Missed", "Overdue"].includes(status);
  const tone = positive
    ? "border-primary/25 bg-primary-soft text-primary-hover dark:text-foreground"
    : pending
      ? "border-warning/25 bg-warning-soft text-warning"
      : negative
        ? "border-danger/25 bg-danger-soft text-danger"
        : "border-border-strong bg-background text-muted dark:bg-border";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"} font-medium ${tone}`}
    >
      {status}
    </span>
  );
}
