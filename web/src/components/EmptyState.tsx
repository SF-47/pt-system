import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";

export default function EmptyState({ title, description, icon, children }: {
  title: string;
  description: string;
  icon?: IconName;
  children?: ReactNode;
}) {
  return (
    <div className="px-5 py-12 text-center whitespace-normal">
      {icon && <Icon name={icon} className="mb-3 size-6 text-muted" />}
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{description}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}
