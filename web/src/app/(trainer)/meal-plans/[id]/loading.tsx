export default function Loading() {
  return (
    <div aria-label="Loading meal plan" aria-busy="true" className="w-full animate-pulse">
      <div className="mb-5 h-5 w-44 rounded bg-border" />
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="w-full max-w-xl">
          <div className="h-4 w-24 rounded bg-border" />
          <div className="mt-2 h-8 w-56 rounded bg-border" />
          <div className="mt-2 h-4 w-full rounded bg-border" />
          <div className="mt-3 flex gap-5">
            <div className="h-4 w-32 rounded bg-border" />
            <div className="h-4 w-40 rounded bg-border" />
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="h-11 w-28 rounded-md bg-border" />
          <div className="h-11 w-28 rounded-md bg-border" />
        </div>
      </div>
      <div className="mb-3 flex items-end justify-between gap-4 border-t border-border pt-4">
        <div>
          <div className="h-7 w-20 rounded bg-border" />
          <div className="mt-2 h-4 w-72 max-w-full rounded bg-border" />
        </div>
        <div className="h-7 w-20 rounded-md bg-border" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center gap-3 border-t border-border px-4 py-2.5 first:border-t-0">
            <div className="size-7 shrink-0 rounded-md bg-border" />
            <div className="min-w-0 flex-1">
              <div className="h-5 w-1/3 rounded bg-border" />
              <div className="mt-1.5 h-4 w-2/3 rounded bg-border" />
            </div>
            <div className="size-9 shrink-0 rounded-md bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
