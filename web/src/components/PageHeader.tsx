import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="mb-[22px] flex flex-col items-start gap-4 min-[761px]:flex-row min-[761px]:items-center min-[761px]:justify-between">
      <div>
        <h1 className="text-[27px] leading-tight font-bold tracking-[-0.025em] text-foreground dark:text-[#F3F4F6] [overflow-wrap:anywhere] min-[761px]:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-[64ch] text-muted dark:text-[#9CA3AF]">{description}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  );
}
