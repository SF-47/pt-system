import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
};

export default function PageHeader({
  title,
  eyebrow,
  description,
  children,
  compact = false,
}: PageHeaderProps) {
  const spacing = compact ? "mb-5 min-[761px]:mb-4" : "mb-5";

  return (
    <header
      className={`${spacing} flex flex-col items-start gap-4 min-[761px]:flex-row min-[761px]:items-center min-[761px]:justify-between`}
    >
      <div>
        {eyebrow && (
          <p className="mb-1 text-sm font-semibold text-primary">{eyebrow}</p>
        )}
        <h1 className="text-[28px] leading-tight font-bold tracking-[-0.025em] text-foreground dark:text-[#F3F4F6] [overflow-wrap:anywhere] min-[761px]:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-[64ch] text-muted dark:text-[#9CA3AF]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  );
}
