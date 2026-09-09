import Icon from "@/components/Icon";

export default function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Paid" || status === "Completed"
      ? "success"
      : status === "Pending"
        ? "pending"
        : status === "Skipped"
          ? "skipped"
          : "neutral";

  const toneClasses = {
    success: "bg-primary-soft text-success dark:bg-[#173D2A] dark:text-[#86D5A9]",
    pending: "bg-warning-soft text-warning dark:bg-[#3F2A0C] dark:text-[#D97706]",
    skipped: "bg-danger-soft text-danger dark:bg-[#451A1A] dark:text-[#F87171]",
    neutral: "bg-gray-100 text-muted dark:bg-[#2C3238] dark:text-[#9CA3AF]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-2 py-[3px] text-xs font-semibold ${toneClasses[tone]}`}
    >
      <Icon
        name={tone === "success" ? "check" : tone === "pending" ? "clock" : "close"}
        className="size-[13px]"
      />
      {status}
    </span>
  );
}
