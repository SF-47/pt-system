export default function Loading() {
  return (
    <div aria-label="Loading workout plans" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-52 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-44 rounded-lg bg-border" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div key={card} className="min-h-24 rounded-xl border border-border bg-surface p-5">
            <div className="h-3 w-28 rounded bg-border" />
            <div className="mt-3 h-7 w-36 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-sm">
          <div className="mb-2 h-4 w-36 rounded bg-border" />
          <div className="h-12 w-full rounded-md bg-border" />
        </div>
        <div className="h-4 w-48 rounded bg-border" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, card) => (
          <div key={card} className="min-h-55 rounded-2xl border border-border bg-surface p-6">
            <div className="flex justify-between gap-3">
              <div className="h-6 w-1/2 rounded bg-border" />
              <div className="h-6 w-24 rounded bg-border" />
            </div>
            <div className="mt-5 h-4 w-full rounded bg-border" />
            <div className="mt-2 h-4 w-2/3 rounded bg-border" />
            <div className="mt-8 h-10 w-full rounded-lg bg-border" />
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        <div className="h-11 w-24 rounded-md bg-border" />
        <div className="h-4 w-24 rounded bg-border" />
        <div className="h-11 w-20 rounded-md bg-border" />
      </div>
    </div>
  );
}
