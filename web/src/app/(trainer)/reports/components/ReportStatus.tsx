const TONES: Record<string, { text: string; dot: string }> = {
  Completed: {
    text: "text-primary-hover dark:text-primary",
    dot: "bg-primary",
  },
  Pending: { text: "text-warning", dot: "bg-warning" },
  Missed: { text: "text-danger", dot: "bg-danger" },
};

export default function ReportStatus({ status }: { status: string }) {
  const tone = TONES[status] ?? { text: "text-muted", dot: "bg-muted" };
  return (
    <span
      className={`inline-flex w-24 items-center justify-end gap-1.5 text-sm font-semibold whitespace-nowrap print:w-20 print:text-xs ${tone.text}`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${tone.dot}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
