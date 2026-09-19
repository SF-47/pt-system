export default function Loading() {
  return (
    <div aria-label="Loading meal plans" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-4 w-36 rounded bg-border" />
          <div className="mt-3 h-9 w-44 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-40 rounded-md bg-border" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div key={card} className="min-h-24 rounded-lg border border-border bg-surface p-5">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-4 h-7 w-16 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1200px]:grid-cols-3">
        {Array.from({ length: 6 }).map((_, card) => (
          <div key={card} className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="aspect-[16/9] w-full rounded-t-lg bg-primary-soft" />
            <div className="p-5">
              <div className="h-6 w-1/2 rounded bg-border" />
              <div className="mt-3 h-4 w-full rounded bg-border" />
              <div className="mt-2 h-4 w-2/3 rounded bg-border" />
              <div className="mt-5 h-11 rounded-md bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
