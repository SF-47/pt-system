export default function Loading() {
  return (
    <div aria-label="Loading clients" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-36 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-28 rounded-md bg-border" />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="min-h-28 rounded-lg border border-border bg-surface p-5">
            <div className="h-4 w-24 rounded bg-border" />
            <div className="mt-5 h-8 w-14 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-4 h-11 w-full max-w-sm rounded-md bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid min-w-180 grid-cols-5 gap-4 bg-background px-5 py-4">
          {[0, 1, 2, 3, 4].map((cell) => (
            <div key={cell} className="h-4 w-16 rounded bg-border" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="grid min-w-180 grid-cols-5 gap-4 border-t border-border px-5 py-5">
            {[0, 1, 2, 3, 4].map((cell) => (
              <div key={cell} className="h-5 w-4/5 rounded bg-border" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
