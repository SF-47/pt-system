type SummaryMetricProps = {
  label: string;
  value: string | number;
  compact?: boolean;
};

export default function SummaryMetric({
  label,
  value,
  compact = false,
}: SummaryMetricProps) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-lg border border-border bg-surface ${compact ? "min-h-24 gap-2 px-5 py-4" : "min-h-28 gap-3 p-5"}`}
    >
      <p
        className={
          compact
            ? "text-xs font-semibold tracking-wide text-muted uppercase"
            : "text-sm font-medium text-muted"
        }
      >
        {label}
      </p>
      <p
        className={`${compact ? "text-2xl" : "text-[32px]"} leading-none font-semibold tracking-tight text-foreground tabular-nums`}
      >
        {value}
      </p>
    </div>
  );
}
