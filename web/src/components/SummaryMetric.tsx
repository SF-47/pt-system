type SummaryMetricProps = {
  label: string;
  value: string | number;
};

export default function SummaryMetric({
  label,
  value,
}: SummaryMetricProps) {
  return (
    <div className="flex min-h-28 min-w-0 flex-col rounded-xl border border-border bg-surface px-5 py-4">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
        {label}
      </p>
      <p className="mt-auto pt-3 text-[32px] leading-none font-semibold tracking-tight text-primary-hover tabular-nums sm:text-[34px] dark:text-foreground">
        {value}
      </p>
    </div>
  );
}
