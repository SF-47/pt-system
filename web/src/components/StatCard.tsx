type StatCardProps = {
  title: string;
  value: number;
  supportingText?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  supportingText,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`flex min-h-28 flex-col rounded-xl border border-border bg-surface px-5 py-4 ${className}`}
    >
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">
        {title}
      </p>
      <div className="mt-auto pt-3">
        <p className="text-[32px] leading-none font-semibold tracking-tight text-primary-hover tabular-nums sm:text-[34px] dark:text-foreground">
          {value}
        </p>
        {supportingText && (
          <p className="mt-2 text-sm text-muted">{supportingText}</p>
        )}
      </div>
    </div>
  );
}
