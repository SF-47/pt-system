import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  metadata?: ReactNode;
};

export default function PageHeader({
  title,
  eyebrow,
  description,
  children,
  metadata,
}: PageHeaderProps) {
  return (
    <header className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-muted">{eyebrow}</p>
        )}
        <h1 className="text-2xl leading-tight font-semibold tracking-tight wrap-anywhere sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
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
