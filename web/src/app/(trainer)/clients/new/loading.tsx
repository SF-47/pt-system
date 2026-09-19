export default function Loading() {
  return (
    <div aria-label="Loading new client form" aria-busy="true" className="max-w-3xl animate-pulse">
      <div className="mb-5 h-5 w-32 rounded bg-border" />
      <div className="mb-6 h-9 w-44 rounded bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          {Array.from({ length: 6 }).map((_, field) => (
            <div key={field} className={field === 0 ? "sm:col-span-2" : ""}>
              <div className="mb-2 h-4 w-24 rounded bg-border" />
              <div className="h-12 w-full rounded-md bg-border" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 border-t border-border bg-primary-soft/40 px-5 py-4">
          <div className="h-11 w-32 rounded-md bg-border" />
          <div className="h-11 w-24 rounded-md bg-border" />
        </div>
      </div>
    </div>
  );
}
