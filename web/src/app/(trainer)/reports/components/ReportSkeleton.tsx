export default function ReportSkeleton() {
  return (
    <div
      role="status"
      aria-label="Generating report…"
      className="mt-4 space-y-3 print:hidden"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="h-24 animate-pulse motion-reduce:animate-none rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
      <div className="h-28 animate-pulse motion-reduce:animate-none rounded-xl border border-border bg-surface" />
      <div className="h-40 animate-pulse motion-reduce:animate-none rounded-xl border border-border bg-surface" />
    </div>
  );
}
