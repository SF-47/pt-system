type SummaryMetricProps = {
  label: string;
  value: string | number;
};

export default function SummaryMetric({ label, value }: SummaryMetricProps) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 dark:border-[#2C3238] dark:bg-[#1B1F24]">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}
