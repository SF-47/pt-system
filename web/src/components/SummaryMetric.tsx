type SummaryMetricProps = {
  label: string;
  value: string | number;
};

export default function SummaryMetric({ label, value }: SummaryMetricProps) {
  return (
    <div className="flex min-h-24 flex-col justify-between rounded-md border border-border bg-surface p-4 dark:border-[#2C3238] dark:bg-[#1B1F24]">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}
