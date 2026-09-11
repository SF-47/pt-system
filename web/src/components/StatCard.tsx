type StatCardProps = {
  title: string;
  value: number;
  supportingText?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function StatCard({
  title,
  value,
  supportingText,
  variant = "secondary",
  className = "",
}: StatCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`flex min-h-32 flex-col rounded-lg border border-border bg-surface p-4 dark:border-[#2C3238] dark:bg-[#1B1F24] ${className}`}
    >
      <p
        className="text-sm font-semibold text-muted"
      >
        {title}
      </p>
      <div className="mt-auto pt-4">
        <p
          className={`leading-none font-bold tracking-[-0.04em] tabular-nums ${
            isPrimary
              ? "text-[40px]"
              : "text-[32px]"
          }`}
        >
          {value}
        </p>
        {supportingText && (
          <p className="mt-2 text-sm text-muted">{supportingText}</p>
        )}
      </div>
    </div>
  );
}
