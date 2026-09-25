export default function Loading() {
  return (
    <div aria-label="Loading meal plan form" aria-busy="true" className="w-full animate-pulse">
      <div className="mb-5 h-5 w-44 rounded bg-border" />
      <div className="mb-5">
        <div className="h-9 w-56 rounded-md bg-border" />
        <div className="mt-3 h-4 w-full max-w-md rounded bg-border" />
      </div>
      <div className="mb-4 grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-surface">
        {[0, 1, 2].map((step) => (
          <div key={step} className="flex min-h-12 items-center justify-center gap-2 border-r border-border px-4 last:border-r-0">
            <div className="size-6 rounded-full bg-border" />
            <div className="h-4 w-20 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-surface">
        <div className="grid gap-5 p-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="h-5 w-40 rounded bg-border" />
            <div className="mt-2 h-4 w-64 max-w-full rounded bg-border" />
          </div>
          <div className="grid gap-4">
            <div>
              <div className="mb-1.5 h-4 w-24 rounded bg-border" />
              <div className="h-11 w-full rounded-md bg-border" />
            </div>
            <div>
              <div className="mb-1.5 h-4 w-24 rounded bg-border" />
              <div className="h-24 w-full rounded-md bg-border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
