export default function StatusBadge({ status }: { status: string }) {
  const positive = ["Paid", "Completed", "Active"].includes(status);
  const pending = status === "Pending";
  const tone = positive
    ? "bg-primary-soft text-primary-hover dark:text-foreground"
    : pending
      ? "bg-warning-soft text-warning"
      : "bg-background text-muted dark:bg-border";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium ${tone}`}
    >
      {status}
    </span>
  );
}
