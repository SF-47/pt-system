import Icon, { type IconName } from "@/components/Icon";

type StatCardProps = { title: string; value: number; icon: IconName };

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-[9px] border border-border bg-surface p-[18px] dark:border-[#2C3238] dark:bg-[#1B1F24]">
      <span className="mb-3 inline-flex size-[34px] items-center justify-center rounded-md bg-primary-soft text-primary dark:bg-[#173D2A] dark:text-[#86D5A9]">
        <Icon name={icon} />
      </span>
      <p className="mb-1.5 text-[29px] leading-[1.2] font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted">{title}</p>
    </div>
  );
}
