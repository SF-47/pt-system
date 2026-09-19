import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
  metadata?: ReactNode;
};

export default function PageHeader({
  title,
  eyebrow,
  description,
  children,
  compact = false,
  metadata,
}: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col items-start justify-between gap-4 ${compact ? "mb-6" : "mb-6"} sm:flex-row sm:items-center`}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-muted">{eyebrow}</p>
        )}
        <h1 className="text-3xl sm:text-[34px] leading-tight font-semibold tracking-tight wrap-anywhere">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
            {description}
          </p>
        )}
        {metadata && <div className="mt-3 text-sm text-muted">{metadata}</div>}
      </div>
      {children && (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
          {children}
        </div>
      )}
    </header>
  );
}
